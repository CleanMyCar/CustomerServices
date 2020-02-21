CREATE PROCEDURE VerifyRegisterdUser(@MobileNumber Nvarchar(20), @UserId INT)
AS
BEGIN
SELECT UserId FROM register_user_ref WHERE MobileNumber = @MobileNumber AND UserId = @UserId
END


CREATE PROCEDURE UpdateRegisterdUserOtp(@Otp Nvarchar(20), @UserId INT)
AS
BEGIN

update register_user_ref set UserOtp = @Otp WHERE UserId = @UserId;
SELECT UserId FROM register_user_ref WHERE UserId = @UserId

END




CREATE TABLE AppConfigurations(
Id INT Identity(1,1),
ConfigKey Nvarchar(100),
ConfigValue Nvarchar(500)
)

INSERT INTO AppConfigurations VALUES('IOSFcmKey', 'AAAA3rQHCLQ:APA91bFQsPC4vEtdIlvmIu6MrVxZm4E_Zvb9xunBMtXYTIo3llNDiZditEt0e4pM6CKEBKGecoPoavjm2m_7ZgFakEweCDkKWdT3lXQuGTKwVQwU8N_7uM8JkgBG75oA6rOr6H-Qn3rg')




USE [master]
GO
/****** Object:  StoredProcedure [dbo].[GetAssignedVehicleServices]    Script Date: 2/20/2020 9:57:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetAssignedVehicleServices]
(
@ServiceStatusId INT,
@ServiceDate Date,
@ServiceId INT,
@AddressId INT,
@PersonId INT
)
AS 

DECLARE @sqlStmt nvarchar(4000), @whereCondition nvarchar(1000) = '', @othercondition nvarchar(1000) = '';

SET @sqlStmt = 'SELECT (CASE WHEN child.ParentId IS NOT NULL THEN child.RequestId  WHEN child.ParentId IS NULL THEN request.RequestId END ) AS RequestId, 
request.VehicleId, request.ServiceType, Services.ServiceName, 
Services.ServiceId,Services.Price, Services.SubscriptionPrice, request.Frequency, request.ServiceStatusId, request.Promocode, vd.VehicleNumber, 
SubscriptionType.SubscribeType, vd.VehicleName, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) AS ServiceDate, request.TimeSlot, request.RequestedOn, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServicePersonId  WHEN child.ParentId IS NULL THEN request.ServicePersonId END ) AS ServicePersonId,
vd.ParkingLot, Address.AddressLine1,  vd.VehicleTypeId, vpirce.SubscriptionPrice AS FourWheelerSubPrice, vpirce.Price AS FourWheelerOncePrice,
user_ref.UserFirstName, user_ref.UserLastName, user_ref.MobileNumber, request.Quantity, request.ParentId, child.ServiceStatusId AS ChildServiceStatusId,
child.ParentId AS ChildParentId, (select Amount from GetVehiclePriceByRequestId(request.RequestId)) AS RequestPrice,
otherAddress.AddressLine1 AS OtherAddressLine1, otherAddress.AddressLine2 AS OtherAddressLine2, otherAddress.AddressId AS OtherAddressId,
customer.UserFirstName AS CustomerFirstName, customer.UserLastName AS CustomerLastName, customer.MobileNumber AS CustomerMobileNumber
FROM VehicleRequestedServices request
JOIN Services
ON Services.ServiceId = request.ServiceId
LEFT JOIN VehicleDetails vd
ON vd.VehicleId = request.VehicleId
LEFT JOIN SubscriptionType
ON SubscriptionType.SubscribeId = request.Frequency
LEFT JOIN Address
ON Address.AddressId = vd.AddressId
LEFT JOIN VehicleServicePrice vpirce
ON vpirce.ServiceId = request.ServiceId AND vpirce.VehicleCategoryType = vd.FourWheelerTypeId
LEFT JOIN user_ref
ON user_ref.UserId = request.ServicePersonId
JOIN user_ref customer
ON customer.UserId = request.UserId
LEFT JOIN Address otherAddress
ON otherAddress.AddressId = request.OtherAddressId 
LEFT JOIN VehicleRequestedServices child 
ON child.ParentId = request.RequestId';

SET @whereCondition = ' WHERE (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceStatusId WHEN child.ParentId IS NULL THEN request.ServiceStatusId END ) = ''' +  CAST(@ServiceStatusId AS nvarchar)  + ''' ';

IF @ServiceStatusId = 1 
	BEGIN
		
		SET @whereCondition += ' AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate WHEN request.ServiceType = 2 THEN  request.ServiceDate END) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '; 
		SET @othercondition += ' AND request.ParentId IS NULL '
	END
ELSE
	SET @othercondition += ' AND request.ParentId IS NULL AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '

IF @ServiceId IS NOT NULL AND @ServiceId != -1
SET @othercondition += ' AND request.ServiceId=''' + CAST(@ServiceId AS nvarchar) + '''';


IF @AddressId IS NOT NULL AND @AddressId != -1
SET @othercondition += ' AND vd.AddressId=''' + CAST(@AddressId AS nvarchar) + '''';

IF @PersonId IS NOT NULL AND @PersonId != -1
SET @othercondition += ' AND request.ServicePersonId=''' + CAST(@PersonId AS nvarchar)  + '''';

SET @othercondition += ' ORDER BY AddressLine1 ASC, request.ServiceDate DESC';


SET @sqlStmt = @sqlStmt + @whereCondition + @othercondition;
--select @sqlStmt
EXEC(@sqlStmt);

