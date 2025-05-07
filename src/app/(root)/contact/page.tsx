"use client";
import { useRef, useState } from "react";
import { useContact } from "@/context/ContactContext/ContactContext";
import background from "@/assets/img/contact-background.png";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import Icon from "@/components/Icon/Icon";
import Input from "@/components/Input/Input";
import Error from "@/components/Input/Error";
import Label from "@/components/Input/Label";
import Message from "@/components/Message/Message";
import { twitterUrl, linkedinUrl, emailUrl, phoneNumber } from "@/urls";

const heroStyleWhite = {
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const heroStyleDark = {
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

function Contact() {
  const { theme } = useTheme();
  const { createMessage } = useContact();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [status, setStatus] = useState("normal");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleName = () => {
    if (nameRef.current && nameRef.current.value.trim() === "") {
      setNameError(() => "Name is required");
    } else {
      setNameError(() => "");
    }
  };

  const handleEmail = () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (emailRef.current !== null) {
      if (emailRef.current.value.trim() === "") {
        setEmailError(() => "Email is required");
      } else if (emailRegex.test(emailRef.current.value) === false) {
        setEmailError(() => "Invalid email address");
      } else {
        setEmailError(() => "");
      }
    }
  };

  const handleMessage = () => {
    if (messageRef.current !== null) {
      if (messageRef.current.value.trim() === "") {
        setMessageError(() => "Message is required");
      } else {
        setMessageError(() => "");
      }
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setStatus(() => "loading");
    setSuccess(() => false);
    let bug = false;

    if (
      messageRef.current !== null &&
      emailRef.current !== null &&
      nameRef.current !== null
    ) {
      if (messageRef.current.value.trim() === "") {
        messageRef.current.focus();
        setMessageError(() => "Message is required");
        bug = true;
      } else {
        setMessageError(() => "");
      }

      if (emailRef.current.value.trim() === "") {
        emailRef.current.focus();
        setEmailError(() => "Email is required");
        bug = true;
      } else {
        setEmailError(() => "");
      }

      if (nameRef.current.value.trim() === "") {
        nameRef.current.focus();
        setNameError(() => "Name is required");
        bug = true;
      } else {
        setNameError(() => "");
      }

      if (bug) {
        // Check for any error
        setStatus(() => "normal");
        return;
      }

      const data = {
        name: nameRef.current.value.trim(),
        email: emailRef.current.value.trim(),
        message: messageRef.current.value.trim(),
      };

      try {
        const response = await createMessage(data);
        if (response.status === 201) {
          // Successfully created
          setSuccess(() => true);

          nameRef.current.value = "";
          emailRef.current.value = "";
          messageRef.current.value = "";
        }
      } catch (error: any) {
        setError(() => `${error.response.statusText}!`);
      }

      setStatus(() => "normal");
    }
  };

  return (
    <>
      <section
        id="hero"
        style={theme === "light" ? heroStyleWhite : heroStyleDark}
        className="w-full bg-gray-50 flex flex-col justify-center min-h-[40vh] sm:min-h-[60vh]
          lg:py-8"
      >
        <div className="container mx-auto flex flex-col justify-center items-center md:items-start h-full px-4 py-10 space-y-6 sm:px-14">
          <h1
            className="font-serif font-extrabold text-5xl text-white dark:text-zinc-100 text-center space-y-1
              md:text-6xl"
          >
            <span>Contact Me</span>
          </h1>

          <p className="text-xl text-center text-white dark:text-zinc-100">
            For any inquiries or requests, feel free to contact me via the links
            below.
          </p>
        </div>
      </section>

      <aside id="content" className="w-full bg-zinc-200 dark:bg-zinc-700 px-4">
        <div className="container mx-auto pt-8 pb-24 sm:py-16 sm:pb-20">
          <h2 className="text-xl font-bold  py-3 border-b border-b-zinc-500 dark:text-zinc-100 text-center sm:text-2xl sm:text-left">
            Get in touch
          </h2>

          <p className="dark:text-zinc-100 mt-6 text-lg text-center sm:text-xl sm:text-left">
            Do you have any questions or would like to receive further
            information about my work? Feel free to contact me through the
            following links below or connect with me directly on social media. I
            will make sure to get back to you as soon as possible.
          </p>
        </div>
      </aside>

      <section id="contact" className="w-full dark:bg-zinc-600 px-4">
        <div className="container mx-auto py-10 flex flex-col gap-x-10 lg:flex-row">
          <article className="w-full flex flex-col items-center py-10 lg:w-1/3 lg:items-start">
            <div
              className="bg-white -mt-32 dark:bg-zinc-800 rounded-xl p-6 max-w-md space-y-2 flex flex-col 
                items-center drop-shadow-lg sm:p-10 sm:py-12 md:mx-0"
            >
              <div className="flex justify-center">
                <h3 className="text-2xl text-center bg-primaryLight py-1 px-4 font-extrabold text-zinc-100 lg:text-left">
                  Contact info
                </h3>
              </div>

              <a
                href={`mailto:${emailUrl}`}
                rel="noopener noreferrer"
                className="group text-xl dark:text-zinc-100 flex items-center py-1"
              >
                <span>Email: </span>
                <span className="underline group-hover:no-underline">
                  {emailUrl}
                </span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-[#1D9BF0] text-xl dark:text-zinc-100
                    flex items-center gap-2"
              >
                <span className="underline group-hover:no-underline">
                  Follow me on twitter
                </span>
                <Icon
                  name="twitter"
                  color={theme === "light" ? "#1D9BF0" : "#ffffff"}
                  classes="h-10 w-10 transition-transform group-hover:scale-95"
                />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-primary text-xl dark:text-zinc-100
                    flex items-center gap-2"
              >
                <span className="underline group-hover:no-underline">
                  Connect with me on linkedin
                </span>
                <Icon
                  name="linkedin"
                  color={theme === "light" ? "#027373" : "#ffffff"}
                  classes="h-10 w-10 transition-transform group-hover:scale-95"
                />
              </a>
            </div>
          </article>

          <article className="w-full flex flex-col items-center pt-4 pb-10 lg:w-1/2 md:pl-10 lg:items-start">
            <form
              onSubmit={handleSubmit}
              id="contact-form"
              method="post"
              className="w-full space-y-4 sm:space-y-6"
            >
              {
                /** Error message */
                error && <Message type="error" message={error} />
              }

              <div className="flex flex-col space-y-2">
                <Label htmlFor="name" text="Name" />
                <div>
                  <Input
                    type="text"
                    disabled={status === "loading"}
                    name="name"
                    id="name"
                    inputRef={nameRef}
                    handleChange={handleName}
                    error={nameError !== ""}
                  />
                  <Error active={nameError !== ""} text={nameError} />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" text="Email" />
                <div>
                  <Input
                    type="email"
                    disabled={status === "loading"}
                    name="email"
                    id="email"
                    inputRef={emailRef}
                    handleChange={handleEmail}
                    error={emailError !== ""}
                  />
                  <Error active={emailError !== ""} text={emailError} />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="message" text="Message" />
                <div>
                  <Input
                    type="textarea"
                    disabled={status === "loading"}
                    name="message"
                    id="message"
                    textareaRef={messageRef}
                    handleChange={handleMessage}
                    error={messageError !== ""}
                  />
                  <Error active={messageError !== ""} text={messageError} />
                </div>
              </div>

              <div className="flex justify-center mt-8 sm:mt-10">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex flex-row items-center text-base font-semibold px-5 pl-6 py-4 bg-primary rounded-md
                      text-white gap-x-2 drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed outline-offset-2 outline-primary outline-1 focus:outline
                      active:drop-shadow-none hover:underline hover:bg-primaryLight"
                >
                  <span className={`text-lg sm:text-xl`}>
                    {status === "loading"
                      ? "Message sending..."
                      : "Send Message"}
                  </span>
                  <Icon
                    name="right-arrow-head"
                    color="#ffffff"
                    classes="h-3 w-3 -mb-1"
                  />
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>

      {success && (
        <div className="fixed left-4 bottom-4 flex flex-col space-y-4 z-10">
          <Message type="success" message="Message sent successfully!" />
        </div>
      )}
    </>
  );
}

export default Contact;
