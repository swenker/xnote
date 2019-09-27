import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import NavBar from "./NavBar";
import { useAuth0 } from "./react-auth0-wrapper";
import Profile from "./Profile";
import PrivateRoute from "./PrivateRoute";


const customHistory = createBrowserHistory();
const loginSuccessful = true;
const totalPages = 10;
const totalCounter = 168;


class Appold extends React.Component {
  render() {
    return (<Workspace />)
  }
}

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="App">
      <Router>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;

class Workspace extends React.Component {
  render() {
    if (loginSuccessful) {

      return (<DataDock />);
    } else {
      return (<Home />);
    }
  }
}

class Home extends React.Component {

  render() {
    return (
      <div>
        <div>
          <h1>XNote</h1>
          <p>Sign in to get access of your notes </p>
        </div>
      </div>
    )
  }
}
class DataDock extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/new" component={NoteForm} />
        <Route path="/list/:kw" component={NoteListLayout} />
        {/* <Route path="/list" component={NoteListLayout} /> */}
        <Route path="/" exact component={NoteListLayout} />
        {/* <Redirect from="/" to="/list" /> */}
        {/* <Route component={NotFound} /> */}
      </Router>
    )
  }
}

class NotFound extends React.Component {
  render() {
    return (
      <p>Ooops,Not found!!</p>
    );
  }
}

class LoginForm extends React.Component {
  render() {
    return (<p> hello world </p>
    );
  }
}

class FormFooter extends React.Component {
  render() {
    return (
      <Router history={customHistory} >
        <div>
          <Link to="/new">New Note</Link> ||
          <Link to="/list">Note List</Link>
        </div>
      </Router>
    );
  }
}

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: '',
      id: 0,
      title: '',
      content: '',
      status: 0,
    };

    this.handleSaveData = this.handleSaveData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fillForm();

  }

  fillForm() {
    console.log(this.props.match)
    fetch("http://localhost/api/get/1")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            id: result.id,
            title: result.title,
            content: result.content,
            status: result.status,
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    // this.setState({ [event.target.name]: event.target.value })
  }

  handleSaveData(event) {
    fetch("http://localhost/api/save", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: this.state.id, title: this.state.title, content: this.state.content, uid: 1, status: 0 })
    }
    ).then(
      (result) => {
        console.log(result.message);
        this.setState({
          notification: result.message,
        });
      },
      (error) => {
        this.setState({
          notification: error
        });
      })
  }

  render() {
    return (
      <div id="id_div_note">
        <div id="notification"><span>- {this.state.notification}</span> </div>
        <input type="hidden" name="id" defaultValue={this.state.id} />
        <div >
          <input name="title" defaultValue={this.state.title} onChange={event => this.handleChange(event)} size="20" maxLength="50" />
          <button type="button" onClick={this.handleSaveData}>Save</button>
        </div>
        <div>
          <textarea name="content" vupdate_timealue={this.state.content} onChange={event => this.handleChange(event)} cols="35" rows="10"></textarea>
        </div>
        <div>
          <button type="button" onClick={this.handleSaveData}>Save</button>&nbsp;
          <button type="reset">Clear</button>

          <FormFooter />
        </div>
      </div>
    )
  }
}


class NoteListLayout extends React.Component {
  render() {
    return (
      <div>
        <div id="list_header" >
          <ListNavigator />
        </div>
        <div id="notes_list">
          <NoteListData kw={this.props.match.params.kw} />
        </div>
      </div>
    )
  }
}

class ListNavigator extends React.Component {
  render() {
    return (
      // <Router history={customHistory} >
      <Router>
        <div>
          <span>[[{totalCounter}}] {totalPages}]</span>
          <Link to="/new"> New</Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to="/list">Prev</Link>
          <span>&nbsp;|&nbsp;</span>
          <Link to="/list">Next</Link>
        </div>
      </Router>
    );
  }
}

class NoteListData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://localhost/api/search/" + this.props.kw)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('==========');
          console.log(result);
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else
      return (
        <div>
          {items.map(item => (
            <div key={item.id}>
              <Router>
                <div><Link to={{ pathname: "/new", search: "?id=5" }} >{item.title}</Link>&nbsp;<span >[2019-09-20T09:43:12Z]</span></div>
                <div>{item.content}</div>
                <div><span>[<a href="/xnote/edit/113">Edit</a>]</span>&nbsp;&nbsp;<span>[<a href="/xnote/api/rm/113">Delete</a>]</span></div>
                <div><hr /></div>
              </Router>
            </div>
          ))}

        </div>
      )
  }
}
