CREATE PROCEDURE dbo.SaveServiceDetails
@ServiceId INT,
@ServiceName Nvarchar(100),
@Price money,
@SubscriptionPrice money,
@IsEnabled INT,
@ServiceImage TEXT,
@ServiceDescription Text
AS 

IF @ServiceId IS NUll OR @ServiceId = -1
BEGIN
	INSERT INTO Services
	(ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage, ServiceDescription)
	VALUES(@ServiceName, @IsEnabled, @SubscriptionPrice, @Price, 0, 1, @ServiceImage, @ServiceDescription);
	SELECT @ServiceId = SCOPE_IDENTITY()
END
ELSE
	UPDATE Services
		SET ServiceName=@ServiceName, IsEnabled=@IsEnabled, SubscriptionPrice=@SubscriptionPrice, Price=@Price, 
		ServiceImage=@ServiceImage, ServiceDescription=@ServiceDescription
	WHERE ServiceId = @ServiceId;

SELECT @ServiceId AS ServiceId;
