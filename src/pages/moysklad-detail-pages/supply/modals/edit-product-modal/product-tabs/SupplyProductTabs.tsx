import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import SupplyProductStocksTable from './product-stocks-table/SupplyProductStocksTable';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { FC } from 'react';
import SupplyProductHistoryTable from './product-history-table/SupplyProductHistoryTable';

interface SupplyProductTabsProps {
  assortment: IAssortment | undefined;
}

const SupplyProductTabs: FC<SupplyProductTabsProps> = ({ assortment }) => {
  return (
    <Tabs defaultIndex={-1} isLazy w="100%">
      <TabList>
        <Tab>Остатки</Tab>
        <Tab>История</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <SupplyProductStocksTable assortment={assortment} />
        </TabPanel>
        <TabPanel p={0}>
          <SupplyProductHistoryTable assortment={assortment} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SupplyProductTabs;
