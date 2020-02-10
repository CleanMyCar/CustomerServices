USE [master]
GO
/****** Object:  StoredProcedure [dbo].[SaveUserDetail]    Script Date: 2/10/2020 9:10:51 PM ******/
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
			IF EXISTS ( SELECT 1 FROM user_ref
								WHERE Email = @Email OR MobileNumber = @MobileNumber)
			BEGIN
				SELECT @ErrorMessage = 'Email/Mobile Number already exists !!' 
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
				

				INSERT INTO Wallet (Amount, ExpiryDate, UserId)
				SELECT NewUserRechargeAmount, (SELECT CONVERT(date,DATEADD(Day, ValidUpto, getDate()))), @userID FROM Configurations;

				INSERT INTO #UserWallet (WalletAmount, Validity)
				SELECT NewUserRechargeAmount, ValidUpto FROM Configurations;

				DELETE FROM register_user_ref WHERE Email = @Email OR MobileNumber = @MobileNumber;

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

