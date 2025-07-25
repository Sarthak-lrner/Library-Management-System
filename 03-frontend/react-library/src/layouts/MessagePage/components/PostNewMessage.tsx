import { useState } from "react";
import { useAuth } from "../../../Auth/AuthProvider";
import api from "../../../Api/apiClient";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {

    const { isLoggedIn } = useAuth();
    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        if (isLoggedIn && title !== '' && question !== '') {
            try {
                const messageRequestModel: MessageModel = new MessageModel(title, question);

                const response = await api.post('/api/messages/secure/add/message', messageRequestModel);

                setTitle('');
                setQuestion('');
                setDisplayWarning(false);
                setDisplaySuccess(true);
            } catch (error: any) {
                console.error("Submit failed", error);
                setDisplayWarning(true);
                setDisplaySuccess(false);
            }
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }
    return (
        <div className="card mt-3">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Question added successfully</div>
            }
            <div className="card-header">
                Ask Question to Admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields are required
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control"
                            id="exampleFormControlInput" placeholder="Title"
                            onChange={e => setTitle(e.target.value)} value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Question
                        </label>
                        <textarea className="form-control" id="exampleFormControlTextarea1"
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>Submit Question</button>
                    </div>
                </form>
            </div>
        </div>
    );
}