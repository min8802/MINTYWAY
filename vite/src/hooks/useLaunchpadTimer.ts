import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

interface Launchpad {
  subscriptionStartTime: number;
  subscriptionEndTime: number;
  ticketStartTime: number;
  ticketEndTime: number;
  lotteryStartTime: number;
  lotteryEndTime: number;
  redemptionTime: number;
}

export const useLaunchpadTimer = (launchpad: Launchpad) => {
  const { setStep } = useOutletContext<OutletContext>();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentPhase, setCurrentPhase] = useState<string>("subscription");

  useEffect(() => {
    const KST_OFFSET = 9 * 60 * 60 * 1000;

    const calculateTimeLeft = () => {
      const now = Date.now() + KST_OFFSET;

      const phases = [
        {
          name: "preSubscription",
          time: launchpad.subscriptionStartTime + KST_OFFSET,
        },
        {
          name: "subscription",
          time: launchpad.subscriptionEndTime + KST_OFFSET,
        },
        { name: "preTicket", time: launchpad.ticketStartTime + KST_OFFSET },
        { name: "ticket", time: launchpad.ticketEndTime + KST_OFFSET },
        { name: "preLottery", time: launchpad.lotteryStartTime + KST_OFFSET },
        { name: "lottery", time: launchpad.lotteryEndTime + KST_OFFSET },
        { name: "redemption", time: launchpad.redemptionTime + KST_OFFSET },
      ];

      let targetPhase = "end";
      let targetTime = 0;

      for (const phase of phases) {
        if (now < phase.time) {
          targetPhase = phase.name;
          targetTime = phase.time;
          break;
        }
      }

      setCurrentPhase(targetPhase);

      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [
    launchpad.subscriptionStartTime,
    launchpad.subscriptionEndTime,
    launchpad.ticketStartTime,
    launchpad.ticketEndTime,
    launchpad.lotteryStartTime,
    launchpad.lotteryEndTime,
    launchpad.redemptionTime,
  ]);

  const getPhaseText = () => {
    switch (currentPhase) {
      case "preSubscription":
        return "구독 시작 전";
      case "subscription":
        return "구독 진행 중";
      case "preTicket":
        return "티켓 구매 전";
      case "ticket":
        return "티켓 구매 중";
      case "preLottery":
        return "추첨 시작 전";
      case "lottery":
        return "추첨 진행 중";
      case "redemption":
        return "토큰 분배 전";
      case "end":
        return "토큰 분배 / ETH 환불";
      default:
        return "";
    }
  };

  useEffect(() => {
    switch (currentPhase) {
      case "preSubscription":
        console.log("presubscription : ");
        setStep(0);
        break;
      case "preTicket":
        console.log("preticket : ");
        setStep(1);
        break;
      case "preLottery":
        console.log("prelottery : ");
        setStep(2);
        break;
      case "redemption":
        console.log("redemption : ");
        setStep(3);
        break;
      case "end":
        console.log("end : ");
        setStep(4);
        break;
    }
  }, [currentPhase, timeLeft]);

  return { setStep, timeLeft, getPhaseText };
};
