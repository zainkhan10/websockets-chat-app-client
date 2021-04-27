import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'wss://4br1zj34lk.execute-api.eu-west-1.amazonaws.com/ref'

class Chat extends Component {
  state = {
    name: 'Bob',
    messages: [],
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      console.log(message)
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: [message, ...state.messages] }))

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(
      {
        activeSuppliers: [
          {
            connectionSuccessful: "true",
            connectionType: "FTP",
            conversionSuccessfu: "true",
            conversionTyp: "csv",
            name:  "BESTWAY"
          },
          {
            connection: "Pending",
            connectionTyp: "PUSH",
            nam: "BOOKER"
          }
        ],
        audit: {
          request: {
            bucketName: "htec-supplierlink-bucket-ref",
            keyName: "customer/supplier/processed.js"
          },
          requestType: "Trigger"
        },
        createdAt: 1618907801218,
        customerName: "TestCustomer 1",
        id: "118b906d-a2ff-4fe8-9f0b-9c478746ebbb",
        jobTrigger: "scheduled",
        jobType: "retrieve",
        lastUpdated: 1618914543438,
        lastUpdated_String: "2021-04-20T10:29:03.438Z",
        stageStatus: [
          {
            stageID: 1,
            stageName: "customer-retrieve",
            status: "OK"
          },
          {
            stageID: 2,
            stageName: "feed-retrieve",
            status: "inprogress"
          },
          {
            stageID: 3,
            stageName: "feed-convert",
            status: "pending"
          },
          {
            stageID: 4,
            stageName: "feed-load",
            status: "pending"
          },
          {
            stageID: 5,
            stageName: "processors-transform",
            status: "pending"
          },
          {
            stageID: 6,
            stageName: "product-upsert",
            status: "new complete"
          }
        ],
        status: "Updated by zain.",
        uuid: "3b0c3f5a-27c3-43fa-9e65-e6ebb0e07fc4",
        version: "v2"
      }
    ))
    this.addMessage(message)
  }

  render() {
    return (
      <div>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        {this.state.messages.map((message, index) =>
          <ChatMessage
            key={index}
            message={message.message}
            name={message.name}
          />,
        )}
      </div>
    )
  }
}

export default Chat
