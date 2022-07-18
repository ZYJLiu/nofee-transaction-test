import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Confirmed = () => {
  const [percentage, setPercentage] = useState(0);
  const [text, setText] = useState("✅");

  useEffect(() => {
    setPercentage(0);
    const t1 = setTimeout(() => setPercentage(100), 100);

    return () => {
      clearTimeout(t1);
    };
  }, []);

  return (
    <Flex margin="20px" flexDirection="column" alignItems="center">
      <Text margin="20px" fontSize="20px">
        Coupon Successfully Redeemed!
      </Text>
      <CircularProgressbar
        value={percentage}
        text={text}
        styles={buildStyles({
          pathColor: "#00BA00",
        })}
      />
    </Flex>
  );
};

export default Confirmed;
