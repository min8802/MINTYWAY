import { useToast } from "@chakra-ui/react";

const useToastNotification = () => {
  const toast = useToast();

  const showToast = (
    title: string,
    description: string,
    status: "success" | "error" | "warning" | "info",
    duration: number = 3000
  ) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable: true,
      position: "top-right",
    });
  };

  return { showToast };
};

export default useToastNotification;
