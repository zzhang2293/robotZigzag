FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY . /app
WORKDIR /app
RUN apt-get update && apt-get install wait-for-it
RUN pip install -r requirements.txt