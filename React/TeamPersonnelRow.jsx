import debug from "sabio-debug";
import PropTypes from "prop-types";
import React from "react";

const _logger = debug.extend("teamrow");

function TeamPersonnelRow(props) {
  const assignmentIds = props.assignments.map(
    (anAssignment) => anAssignment.gameDayPosition?.id
  );
//maps the user data to the options in the select
  const userMapper = (item) => {
    return (
      <option
        key={item?.user?.firstName + item?.user?.id}
        value={item?.user?.id}
      >
        {item?.user?.firstName + " " + item?.user?.lastName}
      </option>
    );
  };

  const manageChange = (event) => {
    props.onChange(event);
  };

  //this manages the middle row of the table where assigned names are displayed or a select dropdown is displayed
  const nameDataComponent = (aGamePosition) => {

    const isAlreadyAssigned = assignmentIds.includes(aGamePosition.id);

    const mappedUsers = props.users.map(userMapper);

    let selectValue = props.selectedMembers?.find(
      (member) => member.id === aGamePosition.id
    )?.userId;
    //if the user is already assigned a position, display their name
    if (isAlreadyAssigned) {
      const index = props.assignments.findIndex(
        (anAssignment) => anAssignment.gameDayPosition.id === aGamePosition.id
      );

      _logger(index);

      const userNameAssigned =
        props.assignments[index].user.firstName +
        " " +
        props.assignments[index].user.lastName;

      return <p>{userNameAssigned}</p>;
    } 
    //if the official is not already assigned a position, display a dropdown
    else {
      return (
        <select
          name="personnel"
          id={aGamePosition.id}
          onChange={manageChange}
          className="form-select-sm text-primary"
          value={selectValue}
        >
          <option value="">Select a Personnel</option>
          {mappedUsers}
        </select>
      );
    }
  };

  //this manages the rendering of the invite button
  //task: the invite button should only show in the third column if the selected official is NOT a member of the team
  const renderInviteButton = () => {
    //if the row does not contain the selected member, do not render an invite button
    if (!props.selectedMemberId) {
      return null;
    }
    const isAlreadyInvited = props.invitedIds.includes(props.selectedMemberId);
    //if the user has been invited, have the invite button disappear
    if (isAlreadyInvited) {
      return null;
    }

    const selectedIds = props.selectedMembers.map(
      (selectedMember) => selectedMember.userId
    );

    //if the official is already selected for a position, do not render the button
    const isSelected = selectedIds.includes(props.selectedMemberId);

    if (!isSelected) {
      return null;
    }
    
    const isMember = props.teamIds.includes(parseInt(props.selectedMemberId));
    //if the selected official is not apart of the team already, render the invite button on select
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

//PropTypes to manage what is being passed to this component
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
  assignments: PropTypes.shape([
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    PropTypes.bool,
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
      mi: PropTypes.string,
    }),
  ]),
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

};

export default TeamPersonnelRow;
