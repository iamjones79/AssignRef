import { Fragment } from "react";
import { Table } from "react-bootstrap";
import { CardBody } from "reactstrap";
import debug from "sabio-debug";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import lookUpService from "services/lookUpService";
import toastr from "toastr";
import teamGameDayService from "services/teamGameDayService";
import { onGlobalError } from "services/serviceHelpers";
import TeamPersonnelRow from "./TeamPersonnelRow";
import teamInviteEmailService from "services/teamInviteEmailService";

function TeamPersonnelForm() {
  const [tableData, setTableData] = useState({
    userData: [],
    teamIds: [],
    conferenceId: 1,
    assignments: [],
    selectedMembers: [],
    selectedMemberId: 0,
  });

  const [positionData, setPositionData] = useState({ position: [] });
  const [invitedIds, setinvitedIds] = useState([]);

  const url = useLocation();

  const teamId = parseInt(url.pathname.replace(/\D/g, ""));

  const userIndex = tableData.userData.findIndex(
    (singleUser) => singleUser.user.id === parseInt(tableData.selectedMemberId)
  );

  const _logger = debug.extend("teampersonnel");
//use effects to limit re-renders from services
  useEffect(() => {
    _logger("logger from lookup use effect");
    lookUpService
      .lookUp(["GameDayPositions"])
      .then(onLookUpSuccess)
      .catch(onGlobalError);
  }, []);

  useEffect(() => {
    _logger("logger from get by id useeffect");
    teamGameDayService
      .getById(tableData.conferenceId, teamId)
      .then(onGetByIdSuccess)
      .catch(onGlobalError);
  }, []);

  const onLookUpSuccess = (response) => {
    setPositionData((prevState) => {
      const newUserData = { ...prevState };
      newUserData.position = response.item.gameDayPositions;
      return newUserData;
    });
  };

  const onGetByIdSuccess = (response) => {
    const data = response.item;
  //using a for loop so we can add things to state based on index
    for (let index = 0; index < data.length; index++) {
      setTableData((prevState) => {
        const newTableData = { ...prevState };
        if (data[index].gameDayPosition) {
          const member = {
            id: data[index].gameDayPosition.id,
            userId: data[index].user.id,
          };
          newTableData.selectedMembers.push(member);

          newTableData.assignments.push(data[index]);
        }

        if (data[index].isMember) {
          newTableData.teamIds.push(data[index].user?.id);
        }

        const assignmentIds = newTableData.assignments?.map(
          (aSingleAssignment) => aSingleAssignment.user?.id
        );

        if (!assignmentIds.includes(data[index].user?.id)) {
          newTableData.userData.push(data[index]);
        }

        return newTableData;
      });
    }
  };

  const onInviteSuccess = () => {
    toastr.success("Email sent successfully!");

    setinvitedIds((prevState) => {
      const updatedTableData = [...prevState];
      updatedTableData.push(tableData.userData[userIndex].user.id);
      return updatedTableData;
    });
  };

  const onClick = () => {
  //this utilizes a test email
    const payload = {
      RecipientName: `${tableData.userData[userIndex].user.firstName} ${tableData.userData[userIndex].user.lastName}`,
      RecipientEmail: "cijoj55172@eimatro.com",
    };

    teamInviteEmailService
      .teamInviteEmail(payload)
      .then(onInviteSuccess)
      .catch(onGlobalError);
  };

  const handleChange = (event, rowId) => {
    const selectedMemberId = event.target.value;

    setTableData((prevState) => {
      const newTableData = { ...prevState };
      newTableData.selectedMemberId = selectedMemberId;

      const isASelectedMem = tableData.selectedMembers.includes(
        tableData.selectedMembers.find(
          (aMember) => aMember.userId === parseInt(selectedMemberId)
        )
      );

      const member = {};

      const rowIndex = tableData.selectedMembers.findIndex(
        (singleMember) => singleMember.id === rowId
      );
      //this makes sure the user cannot choose the same person for different positions in a dropdown
      if (isASelectedMem) {
        let selectedIndex = tableData.selectedMembers.findIndex(
          (singleMember) => singleMember.userId === parseInt(selectedMemberId)
        );

        newTableData.selectedMembers[selectedIndex].userId = 0;
      }
      //this checks if the position already has an assignment; if yes, replace the user. if no, add an object for the assignment.
      if (rowIndex !== -1) {
        newTableData.selectedMembers[rowIndex].userId =
          parseInt(selectedMemberId);
      } else {
        member.id = rowId;
        member.userId = parseInt(selectedMemberId);
        newTableData.selectedMembers.push(member);
      }

      return newTableData;
    });
  };

  //this will handle the submission process by checking if all fields have been given a position
  let isAllPositionsAssigned = false;
  const selectedValues = tableData.selectedMembers.filter((member) => {
    if (member.userId === 0) {
      return false;
    }
    return true;
  });
  if (selectedValues.length === 10) {
    isAllPositionsAssigned = true;
    _logger(isAllPositionsAssigned);
  }

  //this maps the data to our child component via props
  const mapDataToTable = (data) => {
    const dataIndex = tableData.selectedMembers.findIndex(
      (selectedMember) => selectedMember.id === data.id
    );
    let myMember = null;

    if (dataIndex !== -1) {
      myMember = tableData.selectedMembers[dataIndex].userId;
    } else {
      myMember = tableData.selectedMemberId;
    }

    return (
      <TeamPersonnelRow
        key={data.id}
        positions={data}
        users={tableData.userData}
        assignments={tableData.assignments}
        teamIds={tableData.teamIds}
        invitedIds={invitedIds}
        selectedMemberId={myMember}
        selectedMembers={tableData.selectedMembers}
        onChange={(event) => handleChange(event, data.id)}
        onClick={onClick}
        index={dataIndex}
      />
    );
  };

  const dataForTable = positionData.position.map(mapDataToTable);

  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="border-bottom pb-2 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Team Personnel</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Team Personnel
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      {{isAllPositionsAssigned ? (
        <button
          className="btn btn-warning mb-1 mx-auto"
          style={{ width: "100px" }}
        >
          Submit
        </button>
      ) : null} 
      </div>

      <Row>
        <Col>
          <Card lg={4} md={4} sm={4}>
            <CardBody className="p-0">
              <div className="table-responsive border-0 overflow-y-hidden">
                <Table className="table table-hover">
                  <thead className="table-light">
                    <tr role="row">
                      <th role="columnheader" colSpan="1">
                        Position
                      </th>
                      <th colSpan="1" role="columnheader">
                        Name
                      </th>
                      <th colSpan="1" role="columnheader">
                        Invite
                      </th>
                    </tr>
                  </thead>
                  <tbody>{dataForTable}</tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default TeamPersonnelForm;
