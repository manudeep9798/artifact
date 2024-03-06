import React, { memo, useEffect, useRef } from "react";
import "./index.scss";

const Input = ({
  type = "text",
  placeHolder = "",
  classnames = "",
  initialValue = "",
  inputType = "",
  onChange = () => {},
  selectOptions = [],
}) => {

  const inputRef = useRef();
  
  useEffect(() => {
    inputType === "name" && inputRef.current.focus();
  }, []);

  if (type === "select") {
    return (
      <div className={`inputSelectContainer ${classnames}`}>
        <select onChange={(e) => onChange(inputType, e.target.value)} defaultValue={"Gender"}>
          <option>Select {placeHolder}</option>
          {selectOptions?.map((option, idx) => {
            return <option key={idx}>{option}</option>;
          })}
        </select>
      </div>
    );
  }

  return (
    <div className={`inputContainer ${classnames}`}>
      <input
        ref={inputRef}
        value={initialValue}
        type={type}
        autoComplete="on"
        htmlFor={inputType}
        id={inputType}
        placeholder={placeHolder}
        onChange={(e) => onChange(inputType, e.target.value)}
      />
    </div>
  );
};

export default memo(Input);
