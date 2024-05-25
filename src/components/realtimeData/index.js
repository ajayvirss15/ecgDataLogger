import StartFirebase from "../firebaseConfig/index";
import React from "react";
import { ref, onValue } from "firebase/database";
import { Table } from "react-bootstrap";

const db = StartFirebase();

export class RealtimeData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      maxHeartRate: 0
    };
  }

  componentDidMount() {
    const dbRef = ref(db, "test");

    onValue(dbRef, (snapshot) => {
      let records = [];
      let data = snapshot.val();
      let maxHeartRate = this.state.maxHeartRate;

      // Assume the data object contains heartRate, ecg, LO+, and LO- values
      maxHeartRate = maxHeartRate < data.heartRate ? data.heartRate : maxHeartRate;

      records.push({
        heartRate: data.heartRate,
        ecg: data.ecg,
        loPlus: data.loPlus,
        loMinus: data.loMinus
      });

      this.setState({
        tableData: records,
        maxHeartRate: maxHeartRate
      });
    });
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Current</th>
            <th>Maximum</th>
          </tr>
        </thead>
        <tbody>
          {this.state.tableData.map((row, index) => {
            return (
              <React.Fragment key={index}>
                <tr>
                  <td>Heart Rate:</td>
                  <td>{row.heartRate} bpm</td>
                  <td>{this.state.maxHeartRate} bpm</td>
                </tr>
                <tr>
                  <td>ECG Signal:</td>
                  <td>{row.ecg}</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>LO+:</td>
                  <td>{row.loPlus ? 'Not Connected' : 'Connected'}</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>LO-:</td>
                  <td>{row.loMinus ? 'Not Connected' : 'Connected'}</td>
                  <td>N/A</td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    );
  }
}