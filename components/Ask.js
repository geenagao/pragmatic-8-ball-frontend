import React from "react"
import { StyleSheet, Text, View, Button, TextInput, Picker } from "react-native"
import { Dropdown } from 'react-native-material-dropdown'
import RNShakeEvent from 'react-native-shake-event'

import { StackNavigator } from "react-navigation"
import { connect } from "react-redux"
import { fetchEightBalls, postQuestion } from "../reducers"

class Ask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eightBallIndex: 0,
      eightBallId: 0,
      input: ''
    };
  }

  handlePress(localState) {
    const responses = this.props.eightBalls[this.state.eightBallIndex].responses
    const eightBallName = this.props.eightBalls[this.state.eightBallIndex].name

    // randomly select response
    let max = responses.length
    function getRandomResponse(maxVal) {
      return Math.floor(Math.random() * Math.floor(maxVal))
    }
    let randomId = getRandomResponse(max)
    let responseContent = responses[randomId].content

    let lowerCaseInput = this.state.input.toLowerCase();
    let stateInput = this.state.input

    function sanitizeQuestion () {
      if (eightBallName !== 'Classic 8 Ball Mode') {
        return eightBallName + ' ' + lowerCaseInput
      } else {
        return stateInput
      }
    }

    let completeQuestion = sanitizeQuestion()

    let questionBody = { eightBallId: this.state.eightBallId, input: completeQuestion, responseContent }

    this.props.sendQuestionToServer(questionBody)
    this.props.navigation.navigate('AnswerPage')
  }

  componentWillMount() {
    RNShakeEvent.addEventListener('shake', () => {
      return this.handlePress(this.state);
    });
  }

  componentDidMount() {
    this.props.fetchEightBallsFromServer();
    this.handlePress = this.handlePress.bind(this)
    RNShakeEvent.addEventListener('shake', () => {
      return this.handlePress(this.state)
    })
  }

  componentWillUnmount() {
    RNShakeEvent.removeEventListener('shake');
  }

  render() {
    let data = []
    let eightBalls = this.props.eightBalls.slice(0, this.props.eightBalls.length - 1)
    eightBalls.forEach(element => {
      let valObj = {}
      valObj['eightBallId'] = element.id
      valObj['value'] = element.name
      data.push(valObj)
    });
    return(
      <View>
        <Text style={{ fontSize: 36, color: "purple" }}>What's on your mind?</Text>
        <Dropdown style={{width: 500}}
          label='Ask a question'
          data={data}
          onChangeText={(data,index) => this.setState({ eightBallIndex: index, eightBallId: index + 1 })} />
        <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(input) => {
          this.setState({input})
        }}
        value={this.state.input}
        />
        <Button disabled={this.state.input.length < 1} onPress={() => this.handlePress(this.state)} title="Ask your question!" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

const mapState = function(state) {
  return {
    eightBalls: state.eightBalls
  };
};

const mapDispatch = function(dispatch) {
  return {
    fetchEightBallsFromServer: function() {
      return dispatch(fetchEightBalls());
    },
    sendQuestionToServer: function(questionBody) {
      dispatch(postQuestion(questionBody))
    }
  };
};

export default connect(mapState, mapDispatch)(Ask)
