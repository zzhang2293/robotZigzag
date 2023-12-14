import datetime
import json
from typing import Optional

import pytz
import requests
from django.http import HttpRequest
from django.http import HttpResponse
from django.http import JsonResponse
from requests import ReadTimeout
from rest_framework.decorators import api_view

from maze.models import MazeConfiguration, RunResult
from maze.serializers import MazeConfigurationSerializer
from tournament.models import Tournament


@api_view(["POST"])
def receive_file(request: HttpRequest) -> HttpResponse:
    """
        this function is a receiver for Robot.java file uploading
        do some shallow checking and send the file to simulator
    Args:
        request (HttpRequest): a POST request bring a file in byte format
    Returns:
        HttpResponse: return 200 if it sent successfully, otherwise an error
        signal
    """
    body = request.body.decode("utf-8")
    if not body:
        return JsonResponse({"error": "request cannot be empty"}, status=400)

    data = json.loads(request.body)
    tournament = None
    if "tournament_id" in data:
        maze_configuration = MazeConfiguration.objects.filter(
            tournament__pk=data["tournament_id"]
        ).first()
        tournament = Tournament.objects.get(pk=data["tournament_id"])
    else:
        maze_configuration = MazeConfiguration.objects.filter(
            pk=data["maze_id"]
        ).first()
    response, result = _run_simulation(maze_configuration, data, tournament)
    result.profile = request.user.profile
    result.save()

    return response


def _run_simulation(
    maze_configuration: MazeConfiguration,
    request_data,
    tournament: Optional[Tournament],
):
    result = RunResult()
    result.timestamp = datetime.datetime.now(tz=pytz.timezone("America/New_York"))
    result.duration = 0
    result.result_data = {}
    result.maze_configuration = maze_configuration
    result.did_win = False
    if tournament:
        result.tournament = tournament

    maze = MazeConfigurationSerializer(maze_configuration).data

    maze["num_row"] = len(maze["level_configuration"])
    maze["num_col"] = len(maze["level_configuration"][0])

    url = "http://simulation-manager:9999/file"

    del maze["id"]

    payload = json.dumps({"maze": maze, "java_content": request_data["user_code"]})

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.request(
            "POST", url, headers=headers, data=payload, timeout=15
        )
    except ReadTimeout:
        result.run_error = "Timeout error"
        return (
            JsonResponse(
                {"error": "An unexpected error occurred. Please try again later."},
                status=500,
            ),
            result,
        )

    if response.status_code == 200:
        res_data = json.loads(response.text)

        moves = []
        if not res_data["error"]:
            moves = res_data["log"].strip().split("\n")
            if moves[0] == "-1":
                res_data["error"] = moves[1]

        if not res_data["error"]:
            result.did_win = moves[-1][0] == "1"
            data = {
                "status": "ok",
                "total_time": len(moves) - 2,
                "telemetry": [_convert(i, entry) for i, entry in enumerate(moves[:-1])],
                "did_win": result.did_win,
            }
            # result.result_data = data  # removed to save storage space for db
            result.duration = len(data["telemetry"]) - 1
            if tournament:
                data["telemetry"] = None
        else:
            data = {"status": "error", "details": res_data["error"]}
            result.run_error = res_data["error"]
        return (
            JsonResponse(data=data),
            result,
        )
    else:
        result.run_error = response.reason
        return (
            JsonResponse({"error": response.reason}, status=response.status_code),
            result,
        )


def _convert(i, entry):
    direction, x, y = entry.split(" ")
    return {
        "time": i,
        "x": int(x),
        "y": int(y),
        "direction": ["up", "right", "down", "left"][int(direction)],
    }
