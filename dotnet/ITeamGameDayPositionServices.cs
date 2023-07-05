using Sabio.Models.Domain.TeamGameDayPosition;
using Sabio.Models.Requests.TeamGameDayPositions;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ITeamGameDayPositionServices
    {
        void Add(TeamGameDayPositionAddRequest model);
        void Update(TeamGameDayPositionAddRequest model);

        List<TeamGameDayPosition> GetByTeamId(int conferenceId, int teamId);
    }
}