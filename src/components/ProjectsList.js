import React, { Component } from 'react';
import moment from 'moment';  

export default class ProjectsList extends Component {

    handleSelectionChange(versionName) {
        if(this.props.selectedVersions.indexOf(versionName) === -1) {
          this.props.onSelectedVersionsChange([ ...this.props.selectedVersions, versionName])
        } else {
          this.props.onSelectedVersionsChange(this.props.selectedVersions.filter(v => v !== versionName))
        }
    }

    render() {
        return (
            <div>
                { this.props.projects.map(project => 
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title">{project.name} ({project.projectId})</h5> 
                            </div>
                            <div class="card-body">
                                { !project.services ? <div className="col-md-12"><p>no service</p></div>  : project.services.map(service =>   
                                <div>
                                    <p>Instances of <strong>{service.id}</strong> service:</p>
                                    <table className="table table-sm">
                                    <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">id</th>
                                        <th scope="col">creator</th>
                                        <th scope="col">created</th>
                                        <th scope="col">instances</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { service.versions && service.versions.map(version => 
                                    <tr>
                                        <td>
                                        <input 
                                            type="checkbox"
                                            checked={this.props.selectedVersions.indexOf(version.name) != -1}
                                            disabled={!!version.instances}
                                            onChange={() => this.handleSelectionChange(version.name)} />
                                        </td>
                                        <th scope="row">{version.id}</th>
                                        <td>{version.createdBy}</td>
                                        <td>{moment(version.createTime).fromNow()}</td>
                                        <td>{version.instances ? version.instances.length : 0}</td>
                                        
                                    </tr>
                                    )}  
                                    </tbody>
                                    </table>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        );
    }
}