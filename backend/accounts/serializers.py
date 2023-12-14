from accounts import models
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    @staticmethod
    def get_display_name(instance: models.Profile):
        return instance.display_name or instance.user.username

    def to_internal_value(self, data):
        # Ensure that display_name is included in the validated data for partial updates
        display_name = data.get("display_name")
        data = super(ProfileSerializer, self).to_internal_value(data)
        if display_name is not None:
            data["display_name"] = display_name
        return data

    def create(self, validated_data):
        # Custom logic for setting display_name during creation
        display_name = validated_data.pop("display_name", None)
        instance = super(ProfileSerializer, self).create(validated_data)
        if display_name:
            instance.display_name = display_name
            instance.save()
        return instance

    def update(self, instance, validated_data):
        # Custom logic for setting display_name during update
        display_name = validated_data.pop("display_name", None)
        instance = super(ProfileSerializer, self).update(instance, validated_data)
        if display_name:
            instance.display_name = display_name
            instance.save()
        return instance

    class Meta:
        model = models.Profile
        fields = "__all__"
        read_only_fields = ["user"]
