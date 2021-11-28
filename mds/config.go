package mds

type MdsConfig struct {
	RootStore RootStoreConfig `yaml:"rootStore"`
	Region    string
}

type RootStoreConfig struct {
	Primary  string `yaml:"primary"`
	Replica  string `yaml:"replica"`
	Subspace string `yaml:"subspace"`
}
