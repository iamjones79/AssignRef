using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Conferences;
using Sabio.Models.Domain.Seasons;
using Sabio.Models.Domain.TeamGameDayPosition;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.TeamGameDayPositions;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services
{
    public class TeamGameDayPositionServices : ITeamGameDayPositionServices
    {
        private IDataProvider _data;
        private ILookUpService _lookUpService;
        private IBaseUserMapper _baseUserMapper;

        public TeamGameDayPositionServices(IDataProvider dataProvider, ILookUpService lookUpService, IBaseUserMapper baseUserMapper)
        {
            _data = dataProvider;

            _lookUpService = lookUpService;
            _baseUserMapper = baseUserMapper;
        }

        public void Add(TeamGameDayPositionAddRequest model)
        {

            string procName = "[dbo].[TeamGameDayPositions_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@TeamId", model.TeamId);
                    
                    MapPositionsToTable(model, col);
                    
                },
                returnParameters: null);
        }

        public void Update(TeamGameDayPositionAddRequest model)
        {
            string procName = "[dbo].[TeamGameDayPositions_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@TeamId", model.TeamId);

                    MapPositionsToTable(model, col);
                },
                returnParameters: null);
        }

        public List<TeamGameDayPosition> GetByTeamId(int conferenceId, int teamId)
        {

            string procName = "[dbo].[Users_Select_Positions_MemberStatus]";

            List<TeamGameDayPosition> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@ConferenceId", conferenceId);
                parameterCollection.AddWithValue("@TeamId", teamId);
            }
               , delegate (IDataReader reader, short set)
               {
                   int startingIndex = 0;
                   TeamGameDayPosition gameDayPositions = MapSingleGameDayPosition(reader, ref startingIndex);

                   if (list == null)
                   {
                       list = new List<TeamGameDayPosition>();
                   }
                   list.Add(gameDayPositions);
               }
               );
            return list;
        }
        private static void MapPositionsToTable(TeamGameDayPositionAddRequest model, SqlParameterCollection col)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("GameDayPositionId", typeof(int));
            dt.Columns.Add("UserId", typeof(int));
            foreach (GameDayPosition itemId in model.GameDayPositions)
            {

                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr[startingIndex++] = itemId.GameDayPositionId;
                dr[startingIndex++] = itemId.UserId;

                dt.Rows.Add(dr);
            }
            col.AddWithValue("@BatchInsertGameDayPositions", dt);
        }
        private  TeamGameDayPosition MapSingleGameDayPosition(IDataReader reader, ref int startingIndex)
        {

            TeamGameDayPosition gameDayPositions = new TeamGameDayPosition();
         
            gameDayPositions.User = _baseUserMapper.MapBaseUser(reader, ref startingIndex);

            gameDayPositions.Email = reader.GetSafeString(startingIndex++);

            gameDayPositions.GameDayPosition = reader.DeserializeObject<LookUp>(startingIndex++);
            
            gameDayPositions.IsMember = reader.GetSafeBool(startingIndex++);

            return gameDayPositions;
        }
    }

    }
