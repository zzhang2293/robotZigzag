import django_filters
from tournament.models import Tournament


class TournamentFilter(django_filters.FilterSet):
    class Meta:
        model = Tournament
        fields = {
            "id": ["exact"],
            "name": ["exact", "icontains"],
            "start": ["exact", "gte", "lte"],
            "stop": ["exact", "gte", "lte"],
        }
