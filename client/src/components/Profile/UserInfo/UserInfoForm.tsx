import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { Contacts, Profile } from "../../../types/models";
import { updateProfile } from "../../../redux/thunks/users";
import { setProfileEditMode } from "../../../redux/actions/users";
import { getObjectWithoutNullProps } from "../../../utils";

const contactsIcons = {
  github: <div />,
  telegram: <div />,
  email: <div />,
  facebook: <div />,
  twitter: <div />,
  instagram: <div />,
  phoneNumber: <div />
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
    dispatch(setProfileEditMode(false));
  }

  const handleChangeContact = (event: ChangeEvent<HTMLInputElement>) => {
  
  }

  return <div>
    USER INFO FORM
  </div>
}

export default UserInfoForm;