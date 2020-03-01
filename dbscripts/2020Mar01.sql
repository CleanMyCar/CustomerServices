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



USE [master]
GO
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



USE [master]
GO
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








USE [master]
GO
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



USE [master]
GO
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
