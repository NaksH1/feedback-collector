import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddFeedback from "./AddFeedback";
import AddPVFeedback from "./AddPVFeedback";

function ViewFeedback() {
  const { feedbackId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const fetchResult = await axios({
          method: 'get',
          url: `http://localhost:3000/feedback/view/${feedbackId}`,
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });
        setFeedback(fetchResult.data.feedback);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [feedbackId]);

  const getTrainingFeedback = () => {

    if (feedback && feedback.volunteerId && feedback.eventId) {
      const otherInfo = {
        volunteerName: feedback.volunteerId.name,
        volunteerId: feedback.volunteerId._id,
        event: feedback.eventId
      }
      return (
        <AddFeedback
          viewFeedback={feedback}
          otherInfo={otherInfo}
          toUpdate={true}
        />
      );
    } else {
      return <span>Invalid feedback data</span>;
    }
  };

  const getProgramVolunteerFeedback = () => {
    if (feedback && feedback.volunteerId && feedback.eventId) {
      const otherInfo = {
        volunteerName: feedback.volunteerId.name,
        volunteerId: feedback.volunteerId._id,
        event: feedback.eventId
      }
      return (
        <AddPVFeedback
          viewFeedback={feedback}
          otherInfo={otherInfo}
          toUpdate={true}
        />
      );
    } else {
      return <span>Invalid feedback data</span>
    }
  }

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <br />
          {feedback?.type === 'training' ? getTrainingFeedback() : feedback?.type === 'programVolunteer' ? getProgramVolunteerFeedback() : <></>}
        </>
      )}
    </>
  );
}

export default ViewFeedback;
