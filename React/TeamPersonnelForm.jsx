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
import swal from "sweetalert";

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
    finalSelectedValues: [],
  });

  const [positionData, setPositionData] = useState({ position: [] });
  const [invitedIds, setinvitedIds] = useState([]);

  const url = useLocation();

  const teamId = parseInt(url.pathname.replace(/\D/g, ""));

  const userIndex = tableData.userData.findIndex(
    (singleUser) => singleUser.user.id === parseInt(tableData.selectedMemberId)
  );

  let isAllPositionsAssigned = false;

  const _logger = debug.extend("teampersonnel");

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

    for (let index = 0; index < data.length; index++) {
      setTableData((prevState) => {
        const newTableData = { ...prevState };
        if (data[index].gameDayPosition) {
          const member = {
            userId: data[index].user.id,
            gameDayPositionId: data[index].gameDayPosition.id,
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
    const payload = {
      RecipientName: `${tableData.userData[userIndex].user.firstName} ${tableData.userData[userIndex].user.lastName}`,
      RecipientEmail: tableData.userData[userIndex].email,
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
        (singleMember) => singleMember.gameDayPositionId === rowId
      );

      if (isASelectedMem) {
        let selectedIndex = tableData.selectedMembers.findIndex(
          (singleMember) => singleMember.userId === parseInt(selectedMemberId)
        );

        newTableData.selectedMembers[selectedIndex].userId = 0;
      }
      //if it doesnt exist, rowindex will be -1
      if (rowIndex >= 0) {
        newTableData.selectedMembers[rowIndex].userId =
          parseInt(selectedMemberId);
      } else {
        member.userId = parseInt(selectedMemberId);
        member.gameDayPositionId = rowId;
        newTableData.selectedMembers.push(member);
      }

      newTableData.finalSelectedValues = tableData.selectedMembers.filter(
        (member) => {
          return member.userId !== 0;
        }
      );

      return newTableData;
    });
  };

  const mapDataToTable = (data) => {
    const dataIndex = tableData.selectedMembers.findIndex(
      (selectedMember) => selectedMember.gameDayPositionId === data.id
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

  tableData.finalSelectedValues.length !== 10
    ? (isAllPositionsAssigned = false)
    : (isAllPositionsAssigned = true);

  const onSubmit = () => {
    _logger("submitClicked");
    const payload = {
      teamId: teamId,
      gameDayPositions: tableData.selectedMembers,
    };
    teamGameDayService.add(payload).then(onAddSuccess).catch(onAddError);
  };

  const onAddSuccess = () => {
    swal({
      icon: "success",
      title: "Official assignment successful!",
    });
  };

  const onAddError = (err) => {
    _logger("error:", err);
  };

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
        {isAllPositionsAssigned ? (
          <button
            className="btn btn-primary mb-3 mx-2"
            style={{ width: "100px" }}
            onClick={onSubmit}
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
