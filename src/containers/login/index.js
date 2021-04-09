import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockTwoTone from '@material-ui/icons/LockTwoTone';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Autocomplete from '@material-ui/lab/Autocomplete';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      NTUEE
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const options = ["English", "中文"];

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(25),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: 'gray 1px solid',
    borderRadius:'3%',
  },
  avatar: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.success.light,
    height:'70px',
    width:'70px',
  },
  form: {
    width: '80%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  accountmargin: {
    marginBottom: theme.spacing(2),
  },
  language: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(127),
  }
}));

export default function Login() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    account:'',
    password:'',
    showPassword: false,
    language:options[0],
  });
  
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
    <Container component="main" maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockTwoTone style={{ fontSize: 40 }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          {values.language===options[0] ? <div>Sign in</div> : <div>登入</div>}
        </Typography>
        <form className={classes.form} noValidate>
          <OutlinedInput
            margin="normal"
            required
            fullWidth
            id="StudentId"
            placeholder={values.language===options[0] ? "Student ID" : "學號"}
            value={values.account}
            name="StudentId"
            className={classes.accountmargin}
            autoComplete="StudentId"
            onChange={handleChange('account')}
            autoFocus
          />
          <OutlinedInput
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder={values.language===options[0] ? "Password" : "密碼"}
            value={values.password}
            id="password"
            type={values.showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {values.language===options[0] ? <div>Sign in</div> : <div>登入</div>}
          </Button>
          <Box>
            <Copyright />
          </Box>
        </form>
      </div>
    </Container>
    <Autocomplete
        value={values.language}
        onChange={(event, newValue) => {
          setValues({ ...values, language: newValue });
        }}
        className={classes.language}
        id="language"
        options={options}
        style={{ width: 140 }}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
      />
    </div>
  );
}