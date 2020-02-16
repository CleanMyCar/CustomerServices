
CREATE TABLE UserDevices(
    UserDeviceId INT IDENTITY(1,1),
    UserDeviceToken Nvarchar(500),
    UserDeviceType Nvarchar(20),
    UserId INT
)