import React, { useEffect, useState } from "react";
import { friendsServices } from "../../services/friendsServices";
import toastr from "toastr";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function AddOrEditFriend() {


  const [friendData, setFriendData] = useState({
    title: "",
    bio: "",
    summary: "",
    headline: "",
    slug: "",
    statusId: 1, 
    imageTypeId: 3,
    imageUrl: "",
    skills: ["none"],
  });

  const myFriendId = useParams();

  const navigate = useNavigate();

  const { state } = useLocation();

  const onPageLoad = () => {
    if (state) {
      setFriendData((prevState) => {
        const friendData = { ...prevState };

        friendData.title = state.title;
        friendData.bio = state.bio;
        friendData.summary = state.summary;
        friendData.headline = state.headline;
        friendData.slug = state.slug;
        friendData.imageUrl = state.primaryImage.url;
        friendData.id = state.id;

        return friendData;
      });
    }
  };

  /* 
  on friends card we are passing state which has friend data in it
  here we are using uselocation to grab all that data 
  then set it state
  then use state to fill out the form
  */

  useEffect(() => {
    onPageLoad();
  }, []);

  const onSubmitClicked = () => {
    if (myFriendId.friendId) {
      friendsServices
        .update(myFriendId.friendId, friendData)
        .then(onFriendUpdateSuccess)
        .catch(onFriendUpdateError);
    } else {
      console.log(friendData);
      friendsServices
        .addFriend(friendData)
        .then(onFriendAddSuccess)
        .catch(onFriendAddError);
    }
  };

  const onFriendAddSuccess = (response) => {
    console.log(response);
    myFriendId.friendId = response.data.item;

    toastr.success("Add friend successful!");
    navigate(`/friends/${myFriendId.friendId}`);
  };

  const onFriendAddError = (err) => {
    console.error(err);
    toastr.error(
      "Add friend unsucessful. Make sure your slug is different than previous entries."
    );
  };

  const onFriendUpdateSuccess = (response) => {
    console.log(response);
    toastr.success("You successfully updated your friend!");
    navigate("/friends");
  };

  const onFriendUpdateError = (err) => {
    console.error(err);
    toastr.error("Update friend unsuccessful.");
  };

  const onFormFieldChange = (event) => {
    const target = event.target;

    const newFriendValue = target.value;

    const fieldName = target.name;

    setFriendData((prevState) => {
      const dataFromForm = { ...prevState };

      dataFromForm[fieldName] = newFriendValue;

      return dataFromForm;
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <form>
            <div className="form-group">
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                className="form-control"
                onChange={onFormFieldChange}
                name="title"
                aria-describedby="title"
                placeholder="Title"
                value={friendData.title}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Bio">Bio: </label>
              <input
                type="text"
                className="form-control"
                onChange={onFormFieldChange}
                name="bio"
                placeholder="Friend Bio"
                value={friendData.bio}
              />
            </div>
            <div className="form-group">
              <label htmlFor="summary">Summary: </label>
              <input
                type="text"
                className="form-control"
                onChange={onFormFieldChange}
                name="summary"
                placeholder="Summarize the Friend Bio Here"
                value={friendData.summary}
              />
            </div>
            <div className="form-group">
              <label htmlFor="headline">Headline: </label>
              <input
                type="text"
                className="form-control"
                onChange={onFormFieldChange}
                name="headline"
                placeholder="Add a headline for your friend"
                value={friendData.headline}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug: </label>
              <input
                type="text"
                className="form-control"
                onChange={onFormFieldChange}
                name="slug"
                placeholder="Add a slug for your friend"
                value={friendData.slug}
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Add a Picture of Your Friend: </label>
              <input
                type="text"
                className="form-control"
                onChange={onFormFieldChange}
                name="imageUrl"
                placeholder="URL"
                value={friendData.imageUrl}
              />
            </div>
          </form>
          <br />
          <button className="btn btn-primary" onClick={onSubmitClicked}>
            {myFriendId.friendId ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddOrEditFriend;
