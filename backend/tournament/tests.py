from hypothesis import given
from hypothesis.extra.django import TestCase, from_model
from hypothesis.strategies import text, datetimes, timezones

from tournament.models import Tournament


class TournamentTest(TestCase):
    """Unit tests for the tournament app"""

    @given(
        name=text(),
        start=datetimes(timezones=timezones()),
        stop=datetimes(timezones=timezones()),
    )
    def test_create_tournament_times(self, name, start, stop):
        """Test that tournaments are created if the times are valid
        and raises an exception if they are not."""
        if start > stop:
            self.assertRaises(Exception, Tournament.create, name, start, stop)
        else:
            Tournament.create(name, start, stop)

    @given(from_model(Tournament))
    def test_tournament_name(self, tournament):
        """Check if a tournament receives the correct name."""
        self.assertEqual(tournament.name, str(tournament))
