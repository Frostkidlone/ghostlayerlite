#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod ghostlayer {
    use ink::storage::Mapping;

    #[derive(scale::Encode, scale::Decode, Clone, Default)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct ScanResult {
        score: u8,
        label: Vec<u8>,
    }

    #[ink(storage)]
    pub struct GhostLayer {
        results: Mapping<AccountId, ScanResult>,
    }

    impl GhostLayer {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                results: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn submit_scan(&mut self, contract: AccountId, score: u8, label: Vec<u8>) {
            let result = ScanResult { score, label };
            self.results.insert(contract, &result);
        }

        #[ink(message)]
        pub fn get_result(&self, contract: AccountId) -> Option<ScanResult> {
            self.results.get(contract)
        }
    }
}
