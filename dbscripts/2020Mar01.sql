alter table WalletTransactions add Reason nvarchar(500);


/****** Object:  StoredProcedure [dbo].[ManualRechargeToUser]    Script Date: 3/1/2020 2:11:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[ManualRechargeToUser](
@UserId INT,
@Amount money,
@WalletId INT,
@Reason Nvarchar(500)
)
AS
BEGIN

Declare @IsCredited INT;
SET @IsCredited = 1;

IF @Amount < 0
SET @IsCredited = 0;

IF EXISTS(SELECT UserId FROM Wallet WHERE UserId = @UserId)
	UPDATE Wallet SET Amount = userWallet.Amount + @Amount
	FROM Wallet userWallet
	WHERE userWallet.UserId = @UserId;
ELSE 
BEGIN
	INSERT INTO Wallet (UserId, Amount)
	VALUES (@UserId, @Amount)
	SELECT @WalletId = SCOPE_IDENTITY()
END

INSERT INTO WalletTransactions(WalletId, Amount, TransactionTypeId, IsCredited, Reason)
VALUES (@WalletId, @Amount, 1, @IsCredited, @Reason )

SELECT @UserId AS UserId;

END



/****** Object:  StoredProcedure [dbo].[ValidateRegisterUserOtp]    Script Date: 3/1/2020 4:02:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[ValidateRegisterUserOtp] 
@Otp INT,
@MobileNumber Nvarchar(15),
@UserId INT
AS
BEGIN	

 SELECT UserId FROM register_user_ref WHERE MobileNumber = @MobileNumber AND UserOtp = @Otp AND UserId = @UserId;
	
END




/****** Object:  StoredProcedure [dbo].[SaveUserDetail]    Script Date: 3/1/2020 3:37:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveUserDetail] 
	@UserId INT,
	@UserLastName NVARCHAR(50),
	@UserFirstName NVARCHAR(50),
	@Email NVARCHAR(100),
	@UserPassword NVARCHAR(500),
	@StatusId INT,
	@LoggedinUser INT,
	@ProfileImage NVARCHAR(MAX),
	@MobileNumber NVARCHAR(100),
	@ReferralCode NVARCHAR(100),
	@UserOtp NVARCHAR(10),
	@UserRoleId INT,
	@IsMobileNumberVerified INT
AS
BEGIN
	DECLARE @ErrorMessage NVARCHAR(255)
		   ,@ErrorSeverity NVARCHAR(MAX)
		   ,@PswrdExpiryDate DATE
		   ,@RowCount	INT		   
		   ,@UTCDate DATETIME

	SELECT
		@ErrorMessage = ''
	   ,@ErrorSeverity = -1
	   ,@PswrdExpiryDate = DATEADD(DAY,60,GETUTCDATE())
	   ,@RowCount = 0
	   ,@UTCDate = GETUTCDATE()


	   DROP TABLE IF EXISTS #UserWallet;
	   CREATE TABLE #UserWallet(
	   WalletAmount Money,
	   Validity INT)

	

		IF @userID IS NULL OR @userID = -1
		BEGIN
			IF @Email IS NOT NULL AND @Email != ''
				IF EXISTS ( SELECT 1 FROM user_ref
									WHERE Email = @Email OR MobileNumber = @MobileNumber)
				BEGIN
					SELECT @ErrorMessage = 'Email/Mobile Number already exists !!' 
				END
			ELSE IF @Email IS NULL
				IF EXISTS ( SELECT 1 FROM user_ref
									WHERE MobileNumber = @MobileNumber)
				BEGIN
					SELECT @ErrorMessage = 'Mobile Number already exists !!' 
				END
			ELSE
			BEGIN

				INSERT INTO user_ref (
				userLastName,
				userFirstName,
				email,
				userPassword,
				StatusId,
				UpdatedBy,
				DateUpdated,
				ProfileImage,
				MobileNumber,
				ReferralCode,
				UserOtp,
				UserRoleId,
				IsMobileNumberVerified)
					SELECT
						@userLastName
						,@userFirstName
						,@email
						,@userPassword
						,@StatusId
						,@LoggedinUser
						,@UTCDate
						,@ProfileImage
						,@MobileNumber
						,@ReferralCode
						,@UserOtp
						,@UserRoleId
						,@IsMobileNumberVerified

				SELECT @userID = SCOPE_IDENTITY()
				
				IF(@UserRoleId = 2)
				BEGIN
					INSERT INTO Wallet (Amount, ExpiryDate, UserId)
					SELECT NewUserRechargeAmount, (SELECT CONVERT(date,DATEADD(Day, ValidUpto, getDate()))), @userID FROM Configurations WHere StatusId = 1;

					INSERT INTO #UserWallet (WalletAmount, Validity)
					SELECT NewUserRechargeAmount, ValidUpto FROM Configurations WHere StatusId = 1 ;

					DELETE FROM register_user_ref WHERE Email = @Email OR MobileNumber = @MobileNumber;
				END
			END
		END	
		ELSE
		BEGIN
			UPDATE user_ref SET
				userLastName = @userLastName,
				userFirstName = @userFirstName,
				ProfileImage = @ProfileImage,
				UserRoleId = @UserRoleId
				WHERE UserId = @UserId;
		END
		

	SELECT @ErrorMessage AS ErrorMessage ,@ErrorSeverity AS ErrorSeverity;

	SELECT @userID AS UserId;
	SELECT * FROM #UserWallet;
END









/****** Object:  StoredProcedure [dbo].[SaveRegisterUserDetail]    Script Date: 3/1/2020 3:42:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveRegisterUserDetail] 
	@UserId INT,
	@UserLastName NVARCHAR(50),
	@UserFirstName NVARCHAR(50),
	@Email NVARCHAR(100),
	@UserPassword NVARCHAR(500),
	@StatusId INT,
	@LoggedinUser INT,
	@ProfileImage NVARCHAR(MAX),
	@MobileNumber NVARCHAR(100),
	@ReferralCode NVARCHAR(100),
	@UserOtp NVARCHAR(10),
	@UserRoleId INT,
	@IsMobileNumberVerified INT
AS
BEGIN
	DECLARE @ErrorMessage NVARCHAR(255)
		   ,@ErrorSeverity NVARCHAR(MAX)
		   ,@PswrdExpiryDate DATE
		   ,@RowCount	INT		   
		   ,@UTCDate DATETIME 

	SELECT
		@ErrorMessage = ''
	   ,@ErrorSeverity = -1
	   ,@PswrdExpiryDate = DATEADD(DAY,60,GETUTCDATE())
	   ,@RowCount = 0
	   ,@UTCDate = GETUTCDATE()

	

		IF @userID IS NULL OR @userID = -1
		BEGIN
		
			IF @Email IS NOT NULL AND @Email != ''
			
				IF EXISTS ( SELECT 1 FROM user_ref
									WHERE Email = @Email OR MobileNumber = @MobileNumber)
				BEGIN
					SELECT @ErrorMessage = 'Email/Mobile Number already exists !!' 
				END
			ELSE IF @Email IS NULL OR @Email = ''
			
				IF EXISTS ( SELECT 1 FROM user_ref
									WHERE MobileNumber = @MobileNumber)
				BEGIN
					SELECT @ErrorMessage = 'Mobile Number already exists !!' 
				END

			IF @ErrorMessage IS NUll OR @ErrorMessage = ''			
			BEGIN
			
				INSERT INTO register_user_ref (
				userLastName,
				userFirstName,
				email,
				userPassword,
				StatusId,
				UpdatedBy,
				DateUpdated,
				ProfileImage,
				MobileNumber,
				ReferralCode,
				UserOtp,
				UserRoleId)
					SELECT
						@userLastName
						,@userFirstName
						,@email
						,@userPassword
						,@StatusId
						,@LoggedinUser
						,@UTCDate
						,@ProfileImage
						,@MobileNumber
						,@ReferralCode
						,@UserOtp
						,@UserRoleId

				SELECT @userID = SCOPE_IDENTITY()			
				
			END
		END	
		

	SELECT @ErrorMessage AS ErrorMessage ,@ErrorSeverity AS ErrorSeverity;

	SELECT @userID AS UserId;
END



/****** Object:  StoredProcedure [dbo].[SaveUserDetail]    Script Date: 3/1/2020 3:37:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveUserDetail] 
	@UserId INT,
	@UserLastName NVARCHAR(50),
	@UserFirstName NVARCHAR(50),
	@Email NVARCHAR(100),
	@UserPassword NVARCHAR(500),
	@StatusId INT,
	@LoggedinUser INT,
	@ProfileImage NVARCHAR(MAX),
	@MobileNumber NVARCHAR(100),
	@ReferralCode NVARCHAR(100),
	@UserOtp NVARCHAR(10),
	@UserRoleId INT,
	@IsMobileNumberVerified INT
AS
BEGIN
	DECLARE @ErrorMessage NVARCHAR(255)
		   ,@ErrorSeverity NVARCHAR(MAX)
		   ,@PswrdExpiryDate DATE
		   ,@RowCount	INT		   
		   ,@UTCDate DATETIME

	SELECT
		@ErrorMessage = ''
	   ,@ErrorSeverity = -1
	   ,@PswrdExpiryDate = DATEADD(DAY,60,GETUTCDATE())
	   ,@RowCount = 0
	   ,@UTCDate = GETUTCDATE()


	   DROP TABLE IF EXISTS #UserWallet;
	   CREATE TABLE #UserWallet(
	   WalletAmount Money,
	   Validity INT)

	

		IF @userID IS NULL OR @userID = -1
		BEGIN
			IF @Email IS NOT NULL AND @Email != ''
				IF EXISTS ( SELECT 1 FROM user_ref
									WHERE Email = @Email OR MobileNumber = @MobileNumber)
				BEGIN
					SELECT @ErrorMessage = 'Email/Mobile Number already exists !!' 
				END
			ELSE IF @Email IS NULL
				IF EXISTS ( SELECT 1 FROM user_ref
									WHERE MobileNumber = @MobileNumber)
				BEGIN
					SELECT @ErrorMessage = 'Mobile Number already exists !!' 
				END

			IF @ErrorMessage IS NUll OR @ErrorMessage = ''	
			BEGIN

				INSERT INTO user_ref (
				userLastName,
				userFirstName,
				email,
				userPassword,
				StatusId,
				UpdatedBy,
				DateUpdated,
				ProfileImage,
				MobileNumber,
				ReferralCode,
				UserOtp,
				UserRoleId,
				IsMobileNumberVerified)
					SELECT
						@userLastName
						,@userFirstName
						,@email
						,@userPassword
						,@StatusId
						,@LoggedinUser
						,@UTCDate
						,@ProfileImage
						,@MobileNumber
						,@ReferralCode
						,@UserOtp
						,@UserRoleId
						,@IsMobileNumberVerified

				SELECT @userID = SCOPE_IDENTITY()
				
				IF(@UserRoleId = 2)
				BEGIN
					INSERT INTO Wallet (Amount, ExpiryDate, UserId)
					SELECT NewUserRechargeAmount, (SELECT CONVERT(date,DATEADD(Day, ValidUpto, getDate()))), @userID FROM Configurations WHere StatusId = 1;

					INSERT INTO #UserWallet (WalletAmount, Validity)
					SELECT NewUserRechargeAmount, ValidUpto FROM Configurations WHere StatusId = 1 ;

					DELETE FROM register_user_ref WHERE Email = @Email OR MobileNumber = @MobileNumber;
				END
			END
		END	
		ELSE
		BEGIN
			UPDATE user_ref SET
				userLastName = @userLastName,
				userFirstName = @userFirstName,
				ProfileImage = @ProfileImage,
				UserRoleId = @UserRoleId
				WHERE UserId = @UserId;
		END
		

	SELECT @ErrorMessage AS ErrorMessage ,@ErrorSeverity AS ErrorSeverity;

	SELECT @userID AS UserId;
	SELECT * FROM #UserWallet;
END


/****** Object:  StoredProcedure [dbo].[GetAssignedVehicleServices]    Script Date: 3/1/2020 4:36:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].GetCompletedVehicleServices
(
@ServiceStatusId INT,
@ServiceDate Date,
@ServiceId INT,
@AddressId INT,
@PersonId INT,
@MobileNumber Nvarchar(20)
)
AS 

DECLARE @sqlStmt nvarchar(4000), @whereCondition nvarchar(1000) = '', @othercondition nvarchar(1000) = '';

SET @sqlStmt = 'SELECT (CASE WHEN child.ParentId IS NOT NULL THEN child.RequestId  WHEN child.ParentId IS NULL THEN request.RequestId END ) AS RequestId, 
request.VehicleId, request.ServiceType, Services.ServiceName, 
Services.ServiceId,Services.Price, Services.SubscriptionPrice, request.Frequency, request.ServiceStatusId, request.Promocode, vd.VehicleNumber, 
SubscriptionType.SubscribeType, vd.VehicleName, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) AS ServiceDate, request.TimeSlot, request.RequestedOn, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServicePersonId  WHEN child.ParentId IS NULL THEN request.ServicePersonId END ) AS ServicePersonId,
vd.ParkingLot, Address.AddressLine1,  vd.VehicleTypeId, vprice.Amount,
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
LEFT JOIN VehicleServiceTransactions vpirce
ON vpirce.RequestId = request.RequestId
LEFT JOIN user_ref
ON user_ref.UserId = request.ServicePersonId
JOIN user_ref customer
ON customer.UserId = request.UserId
LEFT JOIN Address otherAddress
ON otherAddress.AddressId = request.OtherAddressId 
LEFT JOIN VehicleRequestedServices child 
ON child.ParentId = request.RequestId';

SET @whereCondition = ' WHERE request.ServicePersonId IS NOT NULL AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceStatusId WHEN child.ParentId IS NULL THEN request.ServiceStatusId END ) = ''' +  CAST(@ServiceStatusId AS nvarchar)  + ''' ';

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


IF @MobileNumber IS NOT NULL
SET @othercondition += ' AND customer.MobileNumber=''' + @MobileNumber + '''';

SET @othercondition += ' ORDER BY AddressLine1 ASC, request.ServiceDate DESC';


SET @sqlStmt = @sqlStmt + @whereCondition + @othercondition;
--select @sqlStmt
EXEC(@sqlStmt);





/****** Object:  StoredProcedure [dbo].[GetAssignedVehicleServices]    Script Date: 3/1/2020 4:36:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter PROCEDURE [dbo].GetCompletedVehicleServices
(
@ServiceStatusId INT,
@ServiceDate Date,
@ServiceId INT,
@AddressId INT,
@PersonId INT,
@MobileNumber Nvarchar(20)
)
AS 

DECLARE @sqlStmt nvarchar(4000), @whereCondition nvarchar(1000) = '', @othercondition nvarchar(1000) = '';

SET @sqlStmt = 'SELECT (CASE WHEN child.ParentId IS NOT NULL THEN child.RequestId  WHEN child.ParentId IS NULL THEN request.RequestId END ) AS RequestId, 
request.VehicleId, request.ServiceType, Services.ServiceName, 
Services.ServiceId,Services.Price, Services.SubscriptionPrice, request.Frequency, request.ServiceStatusId, request.Promocode, vd.VehicleNumber, 
SubscriptionType.SubscribeType, vd.VehicleName, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) AS ServiceDate, request.TimeSlot, request.RequestedOn, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServicePersonId  WHEN child.ParentId IS NULL THEN request.ServicePersonId END ) AS ServicePersonId,
vd.ParkingLot, Address.AddressLine1,  vd.VehicleTypeId, vprice.Amount,
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
LEFT JOIN VehicleServiceTransactions vprice
ON vprice.RequestId = request.RequestId
LEFT JOIN user_ref
ON user_ref.UserId = request.ServicePersonId
JOIN user_ref customer
ON customer.UserId = request.UserId
LEFT JOIN Address otherAddress
ON otherAddress.AddressId = request.OtherAddressId 
LEFT JOIN VehicleRequestedServices child 
ON child.ParentId = request.RequestId';

SET @whereCondition = ' WHERE request.ServicePersonId IS NOT NULL AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceStatusId WHEN child.ParentId IS NULL THEN request.ServiceStatusId END ) = ''' +  CAST(@ServiceStatusId AS nvarchar)  + ''' ';

SET @othercondition += ' AND ((request.ServiceType = 1 AND request.ParentId IS NOT NULL) OR (request.ServiceType = 2 AND request.ParentId IS NULL))  AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '

IF @ServiceId IS NOT NULL AND @ServiceId != -1
SET @othercondition += ' AND request.ServiceId=''' + CAST(@ServiceId AS nvarchar) + '''';


IF @AddressId IS NOT NULL AND @AddressId != -1
SET @othercondition += ' AND vd.AddressId=''' + CAST(@AddressId AS nvarchar) + '''';

IF @PersonId IS NOT NULL AND @PersonId != -1
SET @othercondition += ' AND request.ServicePersonId=''' + CAST(@PersonId AS nvarchar)  + '''';


IF @MobileNumber IS NOT NULL
SET @othercondition += ' AND customer.MobileNumber=''' + @MobileNumber + '''';

SET @othercondition += ' ORDER BY vd.VehicleNumber ASC';


SET @sqlStmt = @sqlStmt + @whereCondition + @othercondition;
--select @sqlStmt
EXEC(@sqlStmt);

