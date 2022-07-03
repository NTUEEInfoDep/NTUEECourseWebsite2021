import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import styled from "styled-components";

const ArrowContainer = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: rgba(113, 113, 113, 0.48);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  transition: all 250ms ease-in-out;
  margin: "auto";
  cursor: pointer;
  &:hover {
    border: 2px solid;
  }
`;

const ArrowIcon = styled.div`
  margin-top: 3px;
  color: #fff;
  font-size: 29px;
`;

export default function DownArrow() {
  return (
    <ArrowContainer>
      <ArrowIcon>
        <ExpandMoreIcon />
      </ArrowIcon>
    </ArrowContainer>
  );
}
