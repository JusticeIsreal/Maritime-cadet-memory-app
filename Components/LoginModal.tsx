import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group } from "@mantine/core";

interface ModalProps {
  loginTriger: boolean;
  setLoginTriger: (value: boolean) => void;
}
function LoginModal({ loginTriger, setLoginTriger }: ModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    open();
  }, [loginTriger]);

  const closeModal = () => {
    close();
    setLoginTriger(false);
  };
  return (
    <div className="LoginModal-con">
      <Modal
        opened={opened}
        onClose={closeModal}
        title="Authentication"
        className="modals"
        style={{ background: "red" }}
      >
        Modal conten ghgjghjghj
      </Modal>

      {/* <Group position="center"> */}
      {/* <Button onClick={open}>Open modal</Button> */}
      {/* </Group> */}
    </div>
  );
}

export default LoginModal;
