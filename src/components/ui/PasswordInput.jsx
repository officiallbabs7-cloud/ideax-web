import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "./Input.jsx";

const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false);

  return (
    <Input
      ref={ref}
      type={show ? "text" : "password"}
      icon={Lock}
      rightElement={
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-gray-500 hover:text-brand"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;