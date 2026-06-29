import CarList from '@/features/garage/components/CarList/CarList';
import ControlPanel from '@/features/garage/components/ControlPanel/ControlPanel';

function Garage() {
  return (
    <div>
      <ControlPanel />
      <CarList />
    </div>
  );
}

export default Garage;
