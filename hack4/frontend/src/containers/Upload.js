import Uploader from '../components/Uploader';
import { INSERTPEOPLE_MUTATION } from '../graphql';
import { useMutation } from '@apollo/react-hooks';

import "./Upload.css";


export default function Upload() {

    // TODO get the mutation function
    // pass it to the Uploader component
    const [insertPeople] = useMutation(INSERTPEOPLE_MUTATION);

    return <div id="Upload">
        <div id="PeopleUploader">
            <Uploader tag="People" mutation={insertPeople}/>
        </div>
    </div>;
}
