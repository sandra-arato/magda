import React from "react";
import Form from "muicss/lib/react/form";
import Input from "muicss/lib/react/input";
import Textarea from "muicss/lib/react/textarea";

export default function Contact(props) {
    return (
        <Form>
            <Input label="Name" required={true} floatingLabel={true} />
            <Input
                label="Email"
                type="email"
                floatingLabel={true}
                required={true}
            />
            <Textarea label="comments" floatingLabel={true} required={true} />
            <button variant="raised">Submit</button>
        </Form>
    );
}
