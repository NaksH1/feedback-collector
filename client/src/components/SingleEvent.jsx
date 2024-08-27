import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Events } from "./Event";
import { Container, Grid, Typography } from "@mui/material";
import UpdateCard from "./UpdateEvent";
import VolunteerTable from "./VolunteerTable";

function SingleEvent() {
  const { eventId } = useParams();
  const [events, setEvents] = useState([]);


  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/event/${eventId}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((res) => {
      setEvents(res.data.event);
    })
  }, []);
  return (
    <>
      <Container maxWidth="lg">
        {/* <GrayTopper name={events.name} /> */}
        <Grid container rowSpacing={1}>
          <Grid item lg={6} md={12} sm={12}>
            <UpdateCard sx={{ display: "flex", justifyContent: "center", height: '100%' }} event={events} setEvent={setEvents} />
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            {events ?
              <Events sx={{ display: "flex", justifyContent: "center", height: '100%' }} event={events} />
              : "Loading.."}
          </Grid>
          <Grid item lg={12} md={12} sm={12}>
            <VolunteerTable event={events} />
          </Grid>
        </Grid>
      </Container>
    </>
  )

  function GrayTopper({ name }) {
    return <div style={{ height: 250, background: "#212121", top: 0, width: "100vw", zIndex: 0, marginBottom: -250 }}>
      <div style={{ height: 250, display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <div>
          <Typography style={{ color: "white", fontWeight: 600 }} variant="h3" textAlign={"center"}>
            {name}
          </Typography>
        </div>
      </div>
    </div>
  }
}

export default SingleEvent;
