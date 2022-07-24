import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { API_GATEWAY_ID, STAGE } from './Constant';

const Div = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

const App = () => {
  const [inputText, setInputText] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const url = `wss://${API_GATEWAY_ID}.execute-api.ap-northeast-1.amazonaws.com/${STAGE}`;

  const openConnection = () => {
    setIsLoading(true);
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      webSocket.send(
        JSON.stringify({ "action": "sendmessage", "message": inputText })
      );

      webSocket.onmessage = (response) => {
        console.log(response)
        if (response.data[0] === '{') {
          setResponseMessage(JSON.parse(response.data).message);
        } else {
          setResponseMessage(response.data);
        }
        setIsLoading(false);
      }

      webSocket.onclose = () => {
        alert("close connection.");
      }
    }
  }

  return (
    <div>
      <Grid container style={{ margin: '10px' }} spacing={2}>
        <Grid item xs={2}>
          <Button variant="contained" onClick={openConnection}>open</Button>
        </Grid>
        <Grid item xs={10}>
          <TextField
            id="outlined-basic"
            label="send text"
            variant="outlined"
            onChange={(event) => setInputText(event.target.value)}
            value={inputText}
          />
        </Grid>
        <Grid xs={2}>
          {isLoading ? <CircularProgress /> : null}
        </Grid>
        <Grid xs={3}>
          <Paper elevation={3} style={{ margin: '16px', height: '100px', width: 'auto'}}>
            <Typography style={{margin: '10x'}}>
              <Div>{responseMessage}</Div>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
