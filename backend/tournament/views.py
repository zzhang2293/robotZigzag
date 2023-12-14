from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tournament.models import Tournament
from tournament.serializers import TournamentSerializer
from tournament.filters import TournamentFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from maze.serializers import RunResultSerializer


class TournamentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tournaments to be viewed or edited.
    """

    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id", "name", "start", "stop"]
    filterset_class = TournamentFilter

    @action(detail=True, url_name="leaderboard", methods=["GET"])
    def leaderboard(self, request, pk=None):
        """Get the leaderboard of the tournament"""
        tournament = Tournament.objects.get(pk=pk)
        results = tournament.run_results.filter(did_win=True).order_by("duration")
        leaderboard = []
        seen = set()
        for result in results:
            if result.profile.pk in seen:
                continue
            leaderboard.append(RunResultSerializer(result).data)
            seen.add(result.profile.pk)
        return Response(leaderboard)
