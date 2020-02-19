/****** Object:  StoredProcedure [dbo].[UpdateSubscription]    Script Date: 2/18/2020 9:43:40 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[UpdateSubscription](
@RequestId INT,
@Frequency INT,
@TimeSlot INT,
@WeeklyDay INT,
@UserId INT
)
AS
BEGIN

Declare @prevFrequency INT, @prevTimeslot INT, @prevWeeklyday INT, @IsChanged INT = 0;

SELECT @prevFrequency=Frequency, @prevTimeslot=TimeSlot, @prevWeeklyday=WeeklyDay FROM VehicleRequestedServices WHERE RequestId = @RequestId;

IF(@prevFrequency != @Frequency OR @prevWeeklyday != @WeeklyDay)
BEGIN
	SET @IsChanged = 1;
	UPDATE VehicleRequestedServices SET ServiceStatusId = 3 
	WHERE ParentId = @RequestId AND ServiceDate > FORMAT (getdate(), 'yyyy-MM-dd') AND ServiceStatusId IN (1, 2, 4);

	--UPDATE VehicleRequestedServices SET ServicePersonId = NULL 
	--WHERE RequestId = @RequestId;
END

UPDATE VehicleRequestedServices SET Frequency = @Frequency, TimeSlot = @TimeSlot, WeeklyDay = @WeeklyDay
WHERE RequestId = @RequestId;

SELECT @RequestId AS RequestId, @IsChanged AS IsChanged, Email, MobileNumber FROM user_ref WHERE UserId = @UserId;
SELECT ServiceName, vServices.ServiceId FROM VehicleRequestedServices vServices
JOIN Services 
ON Services.ServiceId = vServices.ServiceId
WHERE RequestId = @RequestId;

END



/****** Object:  StoredProcedure [dbo].[CreateDailySubscriptionItems]    Script Date: 2/18/2020 9:50:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[CreateDailySubscriptionItems] (
@RequestId INT,
@Frequency INT,
@WeekDay INT,
@ServiceDate Date
)
AS
BEGIN

DECLARE @counter INT = 0, @increment INT = 1, @repeat INT = 1, @sqlText NVarchar(4000), @interval NVarchar(20) = 'DAY', 
@selectedDateDay INT = 0, @WeekServiceDate DATE;

SET @selectedDateDay = (select DATEPART(dw, @ServiceDate))

IF @Frequency = 1
	BEGIN--Next 15 items 
		SET @increment = 1;
		SET @repeat = 60;
	END
ELSE IF @Frequency = 4
	BEGIN --Next 10 items 
		SET @increment = 2;
		SET @repeat = 60;
	END
ELSE IF @Frequency = 2 
	BEGIN
		SET @increment = 1;
		SET @repeat = 10;
		SET @interval = 'week';
		SET @WeekServiceDate = CASE WHEN @WeekDay < @selectedDateDay THEN DATEADD(WEEK, 1, DATEADD(Day, @WeekDay-@selectedDateDay, @ServiceDate))
		ELSE DATEADD(Day, @WeekDay-@selectedDateDay, @ServiceDate) END;
	END
ELSE IF @Frequency = 3
	BEGIN
		SET @increment= 1;
		SET @repeat = 3;
		SET @interval = 'month';
	END
ELSE IF @Frequency = 5
	BEGIN
		SET @increment = 1;
		SET @repeat = 1
		SET @interval = 'quarter';
	END
ELSE IF @Frequency = 6
	BEGIN
		SET @increment = 1;
		SET @repeat = 1
	END

	-- SELECT @WeekServiceDate, @WeekDay, @selectedDateDay;
	-- return;
 
WHILE @counter <= @repeat - 1
BEGIN

	 SET @sqlText = 'INSERT INTO VehicleRequestedServices
	(VehicleId, ServiceType, ServiceId, Frequency, Promocode, ServiceStatusId, UserId, TimeSlot, ServiceDate, WeeklyDay, Quantity, 
	OtherAddressId, ParentId, ServicePersonId)
	SELECT VehicleId, ServiceType, ServiceId,' + CAST(@Frequency AS nvarchar) + ', Promocode, ServiceStatusId, UserId, TimeSlot, 
	DATEADD(' + CAST(@interval AS nvarchar) + ',' + CAST(@counter AS nvarchar) + ',' + 
	CASE WHEN @Frequency = 2 THEN ('''' + CAST(@WeekServiceDate AS nvarchar) +'''') ELSE 'ServiceDate' END + 
	') , WeeklyDay, Quantity, 
	OtherAddressId, ' + CAST(@RequestId AS nvarchar) + 
	', ServicePersonId FROM VehicleRequestedServices WHERE RequestId = ' + CAST(@RequestId AS nvarchar);	

	--SELECT @sqlText;

	EXECUTE sp_executesql @sqlText;

    SET @counter = @counter + @increment;
END

END




/****** Object:  StoredProcedure [dbo].[GetAssignedVehicleServices]    Script Date: 2/18/2020 10:59:40 PM ******/
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
request.VehicleId, request.ServiceType, Services.ServiceImage, Services.ServiceName, 
Services.ServiceId,Services.Price, Services.SubscriptionPrice, request.Frequency, request.ServiceStatusId, request.Promocode, vd.VehicleNumber, 
SubscriptionType.SubscribeType, vd.VehicleName, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) AS ServiceDate, request.TimeSlot, request.RequestedOn, request.ServicePersonId,
vd.ParkingLot, Address.AddressLine1,  vd.VehicleTypeId, vpirce.SubscriptionPrice AS FourWheelerSubPrice, vpirce.Price AS FourWheelerOncePrice,
user_ref.UserFirstName, user_ref.UserLastName, user_ref.MobileNumber, request.Quantity, request.ParentId, child.ServiceStatusId AS ChildServiceStatusId,
child.ParentId AS ChildParentId, (select Amount from GetVehiclePriceByRequestId(request.RequestId)) AS RequestPrice,
otherAddress.AddressLine1 AS OtherAddressLine1, otherAddress.AddressLine2 AS OtherAddressLine2, otherAddress.AddressId AS OtherAddressId
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

