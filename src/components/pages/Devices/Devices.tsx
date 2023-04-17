import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { ApiResponseStatus } from '../../../api/ComApi';
import { GetDevice, GetDevices } from '../../../api/ComApiDevice';
import { Device } from '../../../models/Device';
import { DeviceController } from '../../../models/DeviceController';
import { ApiCheckingContent, ApiErrorContent } from '../../utils/ComAPIUtils';

export default function Devices() {

  enum enumModals {
    None,
    AddDevice,
    DeleteDevice
  }

  enum enumModalDeviceFields {
    name,
    type,
    ip
  }

  const [showModal, setShowModal] = useState<enumModals>(enumModals.None);
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDevice, setNewDevice] = useState<Device>(new Device("", "", "", false, false));
  const [watchDevice, setWatchDevice] = useState<Device>();
  const [deviceToDelete, setDeviceToDelete] = useState<Device>();
  const [apiResponseStatus, setApiResponseStatus] = useState<ApiResponseStatus>(ApiResponseStatus.CHECKING);
  const [apiResponse, setApiResponse] = useState<any>();

  // Handlers
  const handleAddDeviceModalChange = (event: any, field: enumModalDeviceFields) => {
    const newDeviceCopy = structuredClone(newDevice);
    switch (field) {
      case enumModalDeviceFields.ip:
        newDeviceCopy.ip = event.target.value
        break;
      case enumModalDeviceFields.name:
        newDeviceCopy.name = event.target.value
        break;
      case enumModalDeviceFields.type:
        newDeviceCopy.type = event.target.value
        break;
      default:
        break;
    }
    setNewDevice(newDeviceCopy);
  }

  const handleOnSubmitAddDevice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowModal(enumModals.None);

    DeviceController.Create(newDevice,
      (response: Device) => {
        setNewDevice(new Device("", "", "", false, false));
        refreshData();
      }
    )
  }

  const handleOnclickDeleteDevice = (id: string) => {
    GetDevice(DeviceController.GetUnPrefixedId(id),
      (response: Device) => {
        setDeviceToDelete(response);
        setShowModal(enumModals.DeleteDevice);
      }
    )
  }

  const handleOnclickConfirmDeleteDevice = () => {
    setShowModal(enumModals.None);
    if (deviceToDelete !== undefined) {
      DeviceController.Delete(
        deviceToDelete.id.toString(),
        () => refreshData()
      )
    }
  }

  const handleOnClickAddToMonitoring = (id: string) => {
    DeviceController.SetMonitored(id,
      true,
      () => refreshData()
    );
  }

  const handleOnClickRemoveFromMonitoring = (id: string) => {
    DeviceController.SetMonitored(id,
      false,
      () => refreshData()
    );
  }

  const handleOnClickAddToWatch = (id: string) => {
    DeviceController.Get(id, (response: Device) => { setWatchDevice(response) });
  }

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setApiResponseStatus(ApiResponseStatus.CHECKING);
    GetDevices(
      (response: Device[]) => {
        setApiResponseStatus(ApiResponseStatus.SUCCESS);
        setApiResponse(response);
        setDevices(response);
      },
      (error: any) => {
        setApiResponse(error.toString());
        setApiResponseStatus(ApiResponseStatus.ERROR);
      }
    )
  }

  function DeviceManagement() {
    return (
      <>
        <Card style={{ width: '35rem', height: '30rem' }}>
          <Card.Body>
            <Card.Title>
              <div className='CustomCardTitleContainer'>
                <div className='CustomCardTitleContainerTexts'>
                  <div className='CustomCardTitleContainerText'>Devices list : </div>
                </div>
                <div className='CustomCardTitleContainerOptions'>
                  <Button variant='outline-secondary' size='sm' onClick={() => setShowModal(enumModals.AddDevice)}>Add Device</Button>
                </div>
              </div>
            </Card.Title>
            <div style={{ height: '25em', overflow: 'auto' }}>
              <Table striped bordered hover size='sm'>
                <thead>
                  <tr>
                    <th className='col-1'>#</th>
                    <th className='col-2'>Type</th>
                    <th className='col-5'>Device name</th>
                    <th className='col-3'>IP</th>
                    <th className='col-1'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices?.length > 0 ? (
                    <>
                      {devices.map((device: Device) => (
                        <tr key={device.id}>
                          <td>{device.id}</td>
                          <td>{device.type}</td>
                          <td>{device.name}</td>
                          <td>{device.ip}</td>
                          {/* <td>{todo.reachable === true ? "connected" : "disconnected"}</td> */}
                          <td>
                            <ButtonGroup>
                              <Button variant='outline-danger' size='sm' onClick={(e) => { handleOnclickDeleteDevice(e.currentTarget.id) }} id={Device.prefixId + device.id.toString()}>Delete</Button>
                              <Button variant='outline-secondary' size='sm' onClick={(e) => { handleOnClickAddToMonitoring(e.currentTarget.id) }} id={Device.prefixId + device.id.toString()}>Monitoring</Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      )
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
              {
                apiResponseStatus === ApiResponseStatus.ERROR ? <ApiErrorContent apiResponse={apiResponse} /> : <></>
              }
              {
                apiResponseStatus === ApiResponseStatus.CHECKING ? <ApiCheckingContent /> : <></>
              }
            </div>
          </Card.Body>
        </Card>
      </>


    )
  };

  function DeviceMonitoring() {
    return (
      <Card style={{ width: '35rem', height: '30rem' }}>
        <Card.Body>
          <Card.Title>
            <div className='CustomCardTitleContainer'>
              <div className='CustomCardTitleContainerTexts'>
                <div className='CustomCardTitleContainerText'>Monitoring list : </div>
              </div>
            </div>
          </Card.Title>
          <div style={{ height: '25em', overflow: 'auto' }}>
            <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th className='col-1'>#</th>
                  <th className='col-5'>Device name</th>
                  <th className='col-3'>IP</th>
                  <th className='col-1'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices?.length ? (
                  <>
                    {devices.filter((e) => e.monitored === true).map((device: Device) => (
                      <tr key={device.id}>
                        <td>{device.id}</td>
                        <td>{device.name}</td>
                        <td>{device.ip}</td>
                        {/* <td>{todo.reachable === true ? "connected" : "disconnected"}</td> */}
                        <td>
                          <ButtonGroup>
                            <Button variant='outline-danger' size='sm' onClick={(e) => { handleOnClickRemoveFromMonitoring(e.currentTarget.id) }} id={Device.prefixId + device.id.toString()}>Remove</Button>
                            <Button variant='outline-secondary' size='sm' onClick={(e) => { handleOnClickAddToWatch(e.currentTarget.id) }} id={Device.prefixId + device.id.toString()}>Watch</Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    )
                    )}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
            {
              apiResponseStatus === ApiResponseStatus.ERROR ? <ApiErrorContent apiResponse={apiResponse} /> : <></>
            }
            {
              apiResponseStatus === ApiResponseStatus.CHECKING ? <ApiCheckingContent /> : <></>
            }
          </div>
        </Card.Body>
      </Card>
    );
  }

  function DeviceMonitor() {
    return (
      <Card style={{ width: '40rem', height: '30rem' }}>
        <Card.Body>
          <Card.Title>
            <div className='CustomCardTitleContainer'>
              <div className='CustomCardTitleContainerTexts'>
                <div className='CustomCardTitleContainerText'>Watching device : {watchDevice?.name} </div>
              </div>
              <div className='CustomCardTitleContainerOptions'>
                <Button variant='outline-secondary' size='sm' onClick={() => setShowModal(enumModals.AddDevice)}>Refresh</Button>
              </div>
            </div>
          </Card.Title>
          <div style={{ height: '25em', overflow: 'auto' }}>
            <div style={{ backgroundColor: 'black', height: "100%", color: "white" }}>
              {watchDevice?.log}
            </div>
            {
              apiResponseStatus === ApiResponseStatus.ERROR ? <ApiErrorContent apiResponse={apiResponse} /> : <></>
            }
            {
              apiResponseStatus === ApiResponseStatus.CHECKING ? <ApiCheckingContent /> : <></>
            }
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div style={{ padding: '20px', display: 'flex', gap: 50 }}>
      <>
      <Container fluid>
        <Row>
        <DeviceManagement />
        <DeviceMonitoring />
        <DeviceMonitor />
        </Row>

      </Container>

        <Modal show={showModal === enumModals.AddDevice} onHide={() => setShowModal(enumModals.None)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleOnSubmitAddDevice}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={newDevice?.name} placeholder={newDevice?.name} onChange={(e) => handleAddDeviceModalChange(e, enumModalDeviceFields.name)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" value={newDevice?.type} onChange={(e) => handleAddDeviceModalChange(e, enumModalDeviceFields.type)}>
                  <option className="d-none"></option>
                  {
                    Device.getTypes().map((element, index) => (
                      <option value={element} key={index}>{element}</option>
                    ))
                  }
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>IP</Form.Label>
                <Form.Control type="text" value={newDevice?.ip} onChange={(e) => handleAddDeviceModalChange(e, enumModalDeviceFields.ip)} />
              </Form.Group>
              <Button type="submit" variant="outline-success" size='sm'>Add</Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showModal === enumModals.DeleteDevice} onHide={() => setShowModal(enumModals.None)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Are you sure to delete this device #{deviceToDelete?.id} : {deviceToDelete?.name} ?</Form.Label>
              </Form.Group>
              <ButtonGroup>
                <Button variant="outline-danger" onClick={handleOnclickConfirmDeleteDevice} size='sm'>Yes</Button>
                <Button variant="outline-success" onClick={() => setShowModal(enumModals.None)} size='sm'>No</Button>
              </ButtonGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    </div>
  )
}


