CREATE PROCEDURE dbo.GetMyServiceProducts
@UserId INT,
@ServiceId INT
AS 
SELECT VehicleId, VehicleNumber, VehicleMake, VehicleModel, ParkingLot, AddressId, IsPersonal, VehicleTypeId, 
FourWheelerTypeId, StatusId, UserId, VehicleImage
FROM VehicleDetails
JOIN Services
ON Services.VehicleCategoryType = VehicleTypeId
WHERE UserId=@UserId AND StatusId = 1 AND ServiceId = @ServiceId;
 