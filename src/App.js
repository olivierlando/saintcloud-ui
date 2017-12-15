/* global location */
/* eslint no-restricted-globals: ["off", "confirm"] */
import React, { Component } from 'react';
import saintcloud from 'saintcloud';
import { GoogleLogin } from 'react-google-login';
import google from 'googleapis';
import ProjectsList from './components/ProjectsList';
const OAuth2 = google.auth.OAuth2;

export default class App extends Component {
  constructor() {
    super(); 
    this.state = {
      projects: [],
      selectedVersions: [],
      loggedIn: false,
      loadingProjects: false,
    };
  }

  onLogin(err, tokenDetails) {
    if(!err) {
      const authObj = new  google.auth.OAuth2();
      authObj.credentials = {
        access_token: tokenDetails.accessToken
      };
      google.options({
        auth: authObj
      });
      this.setState({ loadingProjects: true, loggedIn: true });
      this.loadProjects();
    }
  }

  loadProjects() {
    this.setState({ loadingProjects: true, projects: [] });
    saintcloud.getProjects({}, (err, projects) => {
      this.setState({ loadingProjects: false, projects });
    });
  }

  onDeleteClick() {
    const versions = this.state.selectedVersions.map(versionName => {
      const match = /apps\/(.*)\/services\/(.*)\/versions\/(.*)/g.exec(versionName);
      return match ? {
        projectId: match[1],
        serviceId: match[2],
        versionId: match[3],
      } : null;
    }).filter((version) => version != null);

    if(confirm("Are you sure you want to delete the following versions: \n " + versions.map(v => `- ${v.projectId} ${v.serviceId} ${v.versionId}`).join("\n ") + " ?")) {
      saintcloud.deleteVersions(versions, (successesCount, err) => {
        this.loadProjects();
        alert(`${successesCount} version(s) successfully deleted`);
      });
      
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1>Saintcloud..</h1>
          </div>
        </div>
        <div>
        { !this.state.loggedIn &&
          <GoogleLogin
            clientId="1002886644495-nm3sa71hfp5qetke3ohgp6rh43c52bms.apps.googleusercontent.com"
            buttonText="Login with Google"
            style={{}}
            className="btn btn-primary"
            onSuccess={(res) => this.onLogin(null, res)}
            onFailure={(err) => this.onLogin(err)}
            scope="https://www.googleapis.com/auth/appengine.admin https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only"
          /> }
        { this.state.loggedIn && 
          <div>
            { this.state.loadingProjects ? <div className="row"><p>Loading...</p></div> :
            <div>
              <ProjectsList 
                projects={this.state.projects} 
                selectedVersions={this.state.selectedVersions}
                onSelectedVersionsChange={(selectedVersions) => this.setState({ selectedVersions })}  
              />              
              <div class="row">
                <div class="col-md-12">
                  <button 
                    style={{marginTop: "20px"}} 
                    type="button" 
                    class="btn btn-danger" 
                    disabled={this.state.selectedVersions.length === 0}
                    onClick={() => this.onDeleteClick() }>
                      Delete selected versions
                  </button>
                </div>
              </div>
            </div> }
          </div> }
        </div>
      </div>
    );
  }
}
