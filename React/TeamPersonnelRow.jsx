import debug from "sabio-debug";
import PropTypes from "prop-types";
import React from "react";

const _logger = debug.extend("teamrow");

function TeamPersonnelRow(props) {
  const assignmentIds = props.assignments.map(
    (anAssignment) => anAssignment.gameDayPosition?.id
  );

  false && _logger("log");

  const userMapper = (item) => {
    return (
      <option key={item?.user?.id} value={item?.user?.id}>
        {item?.user?.firstName + " " + item?.user?.lastName}
      </option>
    );
  };

  const manageChange = (event) => {
    props.onChange(event);
  };

  const nameDataComponent = (aGamePosition) => {
    const isAlreadyAssigned = assignmentIds.includes(aGamePosition.id);

    const mappedUsers = props.users.map(userMapper);

    let selectValue = props.selectedMembers?.find(
      (member) => member.gameDayPositionId === aGamePosition.id
    )?.userId;

    if (isAlreadyAssigned) {
      const index = props.assignments.findIndex(
        (anAssignment) => anAssignment.gameDayPosition.id === aGamePosition.id
      );

      const userNameAssigned =
        props.assignments[index].user.firstName +
        " " +
        props.assignments[index].user.lastName;

      return <p>{userNameAssigned}</p>;
    } else {
      return (
        <select
          name="personnel"
          id={aGamePosition.id}
          onChange={manageChange}
          className="form-select-sm text-primary"
          value={selectValue}
        >
          <option value={0}>Select a Personnel</option>
          {mappedUsers}
        </select>
      );
    }
  };

  const renderInviteButton = () => {
    if (!props.selectedMemberId) {
      return null;
    }

    const isAlreadyInvited = props.invitedIds.includes(props.selectedMemberId);
    if (isAlreadyInvited) {
      return null;
    }

    const selectedIds = props.selectedMembers.map(
      (selectedMember) => selectedMember.userId
    );

    const isSelected = selectedIds.includes(props.selectedMemberId);

    if (!isSelected) {
      return null;
    }

    const isMember = props.teamIds.includes(parseInt(props.selectedMemberId));

    if (!isMember) {
      return (
        <button className="btn btn-link btn-sm" onClick={props.onClick}>
          Invite
        </button>
      );
    }
  };

  return (
    <tr key={props.positions.id} id={props.positions.id}>
      <td id={props.positions.id}>{props.positions.name}</td>
      <td>{nameDataComponent(props.positions)}</td>
      <td>{renderInviteButton()}</td>
    </tr>
  );
}

TeamPersonnelRow.propTypes = {
  positions: PropTypes.shape([
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ]),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      email: PropTypes.string,
      isSelected: PropTypes.bool,
    })
  ),
  assignments: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      gameDayPosition: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      isMember: PropTypes.bool,
      user: PropTypes.shape({
        avatarUrl: PropTypes.string,
        firstName: PropTypes.string,
        id: PropTypes.number,
        lastName: PropTypes.string,
        mi: PropTypes.string,
      }),
    })
  ),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  selectedMemberId: PropTypes.number,
  teamIds: PropTypes.arrayOf(PropTypes.number),
  invitedIds: PropTypes.arrayOf(PropTypes.number),
  selectedMembers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      userId: PropTypes.number,
    })
  ),
  index: PropTypes.number,
  selectedValues: PropTypes.arrayOf(PropTypes.number),
};

export default TeamPersonnelRow;

