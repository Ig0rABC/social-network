import React, { ChangeEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Divider, Form, Input } from "antd";
import { GithubOutlined, InstagramOutlined, MailOutlined, SendOutlined, FacebookOutlined, TwitterOutlined, PhoneOutlined } from "@ant-design/icons";
import { Contacts, Profile } from "../../../types/models";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../../redux/thunks/users";
import actions from "../../../redux/actions/users";
import { useForm } from "antd/lib/form/Form";
import { getObjectWithoutNullProps } from "../../../utils";

const { Item } = Form;

const contactsIcons = {
  github: <GithubOutlined />,
  telegram: <SendOutlined />,
  email: <MailOutlined />,
  facebook: <FacebookOutlined />,
  twitter: <TwitterOutlined />,
  instagram: <InstagramOutlined />,
  phoneNumber: <PhoneOutlined />
}

const contactsInitial = {
  github: "https://github.com/",
  facebook: "https://facebook.com/",
  twitter: "https://twitter.com/",
  vk: "https://vk.com/"
}

const contactsPatterns = {
  github: /https:\/\/github.com\/\w+/,
  telegram: /@[\w\d]+/,
  email: /\w+@\w+\.\w{2,}/,
  vk: /https:\/\/vk.com\/(id\d+|[\w\d]{5,32})/,
  facebook: /https:\/\/facebook.com\/[\w\d]+/,
  twitter: /https:\/\/twitter.com\/[\w\d]+/,
  instagram: /@[\w\d]{3,}/,
  phoneNumber: /((\+\d|\d) \d{3} \d{3}-\d{2}-\d{2})|((\+\d|\d) \d{3} \d{3} \d{2} \d{2})|(\+?\d{11})/
}

const contactsArray: string[] = ["github", "email", "vk", "facebook", "twitter", "instagram", "phoneNumber"];

export type UserInfoFormValues = {
  firstName: string,
  lastName: string,
  about: string,
  contacts: Contacts
}

type Props = {
  profile: Profile
}

const UserInfoForm: React.FC<Props> = ({ profile }) => {

  const initialValues = {
    ...profile,
    contacts: {
      ...profile.contacts,
      github: profile.contacts.github || contactsInitial.github,
      facebook: profile.contacts.facebook || contactsInitial.facebook,
      twitter: profile.contacts.twitter || contactsInitial.twitter,
      vk: profile.contacts.vk || contactsInitial.vk
    }
  }

  const dispatch = useDispatch();
  const intl = useIntl();
  const [form] = useForm<UserInfoFormValues>();
  const [contactsStatuses, setContactsStatuses] = useState({
    github: true,
    telegram: true,
    email: true,
    vk: true,
    facebook: true,
    twitter: true,
    instagram: true,
    phoneNumber: true
  });

  const handleFinish = (values: UserInfoFormValues) => {
    const filledContacts: any = {};
    Object.keys(values.contacts).forEach(key => {
      const currentValue = values.contacts[key as keyof Contacts];
      const initialValue = contactsInitial[key as keyof typeof contactsInitial];
      if (currentValue && currentValue !== initialValue) {
        filledContacts[key] = currentValue;
      }
    })
    const filledValues = getObjectWithoutNullProps(values);
    filledValues.contacts = filledContacts;
    for (let key in filledValues.contacts) {
      // @ts-ignore
      if (!contactsStatuses[key]) {
        // @ts-ignore
        return;
      }
    }
    dispatch(updateProfile(values));
  }

  const handleCancel = () => {
    dispatch(actions.setProfileEditMode(false));
  }

  const handleChangeContact = (event: ChangeEvent<HTMLInputElement>) => {
    const contact_id = event.target.id;
    const key = contact_id.replace("contacts_", "");
    const value = form.getFieldValue(['contacts', key]);
    const match = contactsPatterns[key as keyof typeof contactsPatterns].test(value);
    setContactsStatuses({ ...contactsStatuses, [key]: match })
  }

  return <Form form={form} initialValues={initialValues} onFinish={handleFinish}>

    <Item name="firstName">
      <Input
        placeholder={intl.formatMessage({ id: "firstName", defaultMessage: "first name" })}
      />
    </Item>

    <Item name="lastName">
      <Input
        placeholder={intl.formatMessage({ id: "lastName", defaultMessage: "last name" })}
      />
    </Item>

    <Item name="about">
      <Input
        placeholder={intl.formatMessage({ id: "about", defaultMessage: "about" })}
      />
    </Item>

    <Divider plain orientation="right">
      <FormattedMessage
        id="contacts"
        defaultMessage="contacts"
      />
    </Divider>

    {
      contactsArray.map((key, index) => <Item key={index} name={["contacts", key]}
        validateStatus={contactsStatuses[key as keyof typeof contactsStatuses]
          ? "success"
          : "error"
        }>
        <Input onChange={handleChangeContact}
          placeholder={key}
          prefix={
            contactsIcons.hasOwnProperty(key)
              ? contactsIcons[key as keyof typeof contactsIcons]
              : null
          }
        />
      </Item>
      )
    }

    <Item>
      <Button type="primary" htmlType="submit">
        <FormattedMessage id="buttons.save" defaultMessage="save" />
      </Button>
    </Item>

    <Button onClick={handleCancel}>
      <FormattedMessage id="buttons.cancel" defaultMessage="cancel" />
    </Button>

  </Form>
}

export default UserInfoForm;