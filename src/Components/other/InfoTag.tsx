import styled from 'styled-components';
import { TagColors } from '../../utils/constants';

interface InfoTagProps {
  label?: string;
  color?: TagColors;
  className?: string;
}

const InfoTag = ({ label, className }: InfoTagProps) => {
  return (
    <div>
      <Container className={className}>
        <Text>{label}</Text>
      </Container>
    </div>
  );
};

const Container = styled.div`
  background-color: #f3f4f6;
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  gap: 5px;
  width: fit-content;
`;

const Text = styled.div`
  color: #175cd3;
  font-size: 1.4rem;
  line-height: 14px;
`;

export default InfoTag;
