import { Alert, Spinner } from "react-bootstrap";

export function ApiErrorContent(props: { apiResponse: any; }) {
    const apiResponse = props.apiResponse;
    return (
      <Alert variant="danger">
        <Alert.Heading style={{fontSize:"16px"}}>Une erreur est survenue lors de la communication avec l'API</Alert.Heading>
        <p>
          L'erreur était : {apiResponse}.
        </p>
        <hr />
        <p className="mb-0">
          Merci de prendre contact avec votre administrateur afin de résoudre le problème.
        </p>
      </Alert>
    )
  };


  export function ApiCheckingContent(){
    return (
      <>
      {/* <Alert variant="light">
        <Alert.Heading style={{fontSize:"16px"}}>Chargement en cours ... <Spinner animation="border" size="sm" /></Alert.Heading>
      </Alert> */}
      </>
    )
  };
