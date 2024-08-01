import { AssetState } from "./assetState";
import { ApplicationStates } from "./applicationStates";
import { debounce } from "./debounce";

export function updateAssetList(
  setAssetList: React.Dispatch<React.SetStateAction<{ [id: string]: AssetState }>>,
  updater: (arg: { [id: string]: AssetState }) => { [id: string]: AssetState }
) {
  setAssetList((aL) => {
    console.log("Old state:", aL);
    let newState = updater({ ...aL });
    console.log("New state:", newState);
    if (newState) {
      return newState;
    } else {
      console.error("Updater returned undefined state");
      return aL; // Return the previous state to prevent setting undefined
    }
  });
}

export function reload(
  setAssetList: React.Dispatch<React.SetStateAction<{ [id: string]: AssetState }>>,
  setState: React.Dispatch<React.SetStateAction<ApplicationStates>>
) {
  setAssetList((al) => {
    const newList: { [id: string]: AssetState } = {};
    Object.entries(al).forEach(([key, asset]) => {
      newList[key] = new AssetState(asset.asset);
    });
    return newList;
  });
  setState(ApplicationStates.LOADING);
}

export function calculateTotalScoop(assetList: { [id: string]: AssetState }, percentage: number) {
  let totalScoop = 0;
  Object.entries(assetList).forEach(([key, asset]) => {
    if (asset.quote) {
      if (asset.checked) {
        totalScoop += Number(asset.quote.outAmount);
      }
    }
  });
  return (totalScoop * percentage) / 100;
}

export function handlePercentageChange(
  setPercentage: React.Dispatch<React.SetStateAction<number>>,
  setValueToSwap: React.Dispatch<React.SetStateAction<number>>,
  totalScoop: number
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPercentage = parseFloat(e.target.value);
    setPercentage(inputPercentage);
    const calculatedValueToSwap = (totalScoop * inputPercentage) / 100;
    setValueToSwap(calculatedValueToSwap);
  };
}

export function handleTotalScoopChange(
  setTotalScoop: React.Dispatch<React.SetStateAction<number>>,
  setValueToSwap: React.Dispatch<React.SetStateAction<number>>,
  percentage: number
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotalScoop = parseFloat(e.target.value);
    setTotalScoop(newTotalScoop);
    const calculatedValueToSwap = (newTotalScoop * percentage) / 100;
    setValueToSwap(calculatedValueToSwap);
  };
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
