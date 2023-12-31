USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[TeamGameDayPositions_Insert]    Script Date: 7/5/2023 11:40:33 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Isaiah Jones
-- Create date: 6/3/2023
-- Description:BatchInsert into dbo.TeamGameDayPositions
--			    
--Params:		@BatchInsertGameDayPositions dbo.BatchInsertGameDayPositions READONLY
--				,@TeamId int
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

ALTER PROC [dbo].[TeamGameDayPositions_Insert]
	@BatchInsertGameDayPositions dbo.BatchInsertGameDayPositions READONLY
	,@TeamId INT
			
AS

/*	
	DECLARE 
		@BatchInsertGameDayPositions dbo.BatchInsertGameDayPositions
		,@TeamId int = 6

	INSERT INTO @BatchInsertGameDayPositions 
		(
		GameDayPositionId
		, UserId)
	values 
		(8,11)

	EXECUTE dbo.TeamGameDayPositions_Insert 
		@BatchInsertGameDayPositions
		,@TeamId

	SELECT * FROM dbo.TeamGameDayPositions


*/

BEGIN

	INSERT INTO dbo.TeamGameDayPositions
		(
		[TeamId]
		,[GameDayPositionId]
		,[UserId]
		)
	SELECT 
		@TeamId
		,b.GameDayPositionId
		,b.UserId 
	FROM @BatchInsertGameDayPositions AS b
	WHERE NOT EXISTS 
	(SELECT 1 FROM dbo.TeamGameDayPositions as g
	WHERE g.TeamId = @TeamId
	AND g.UserId = b.UserId
	OR g.GameDayPositionId = b.GameDayPositionId)

END