import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { FC } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dummyData from "../data/dummyData.json";
import { useNavigate } from "react-router-dom";

const sliderSettings = {
  dots: false,
  infinite: true,
  slidesToShow: 7,
  slidesToScroll: 3,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  centerPadding: "0px",
};

const NewTokenCard: FC = () => {
  const navigate = useNavigate();

  const onClickToken = (token: IToken) => {
    navigate(`/token/${token.contractAddress}`, { state: token });
  };

  return (
    <Flex w="70%" flexDir="column" justifyContent="center">
      <Slider {...sliderSettings}>
        {dummyData.map((v, i) => (
          <Button
            key={i}
            display="flex"
            flexDir="column"
            p={4}
            borderWidth="2px"
            borderColor="white"
            bgColor="gray.700"
            _hover={{ borderColor: "teal" }}
            h="115px"
            maxW="155px"
            onClick={() => onClickToken(v)}
          >
            <Flex flexDir="column" alignItems="center">
              <Image
                src={v.imageUrl}
                alt="coin"
                w="40px"
                h="40px"
                borderRadius="full"
              />

              <Text fontSize="md" mt={2} color="white" fontWeight="bold">
                {v.tokenName.length > 14
                  ? `${v.tokenName.slice(0, 14)}...`
                  : v.tokenName}{" "}
              </Text>
              <Text fontSize="sm" color="white" fontWeight="bold">
                symbol
              </Text>
            </Flex>
          </Button>
        ))}
      </Slider>
    </Flex>
  );
};

export default NewTokenCard;
