namespace SADCOMS.Domain.Validation;

public static class SadcCurrencyValidator
{

    private static readonly Dictionary<string, string[]> _validCurrencies = new()
  {
      { "ZA", new[] { "ZAR" } },
      { "BW", new[] { "BWP" } },
      { "ZW", new[] { "ZWL", "USD" } },
      { "NA", new[] { "NAD", "ZAR" } },
      { "LS", new[] { "LSL", "ZAR" } },
      { "SZ", new[] { "SZL", "ZAR" } },
      { "ZM", new[] { "ZMW" } },
      { "MZ", new[] { "MZN" } },
      { "TZ", new[] { "TZS" } },
      { "MW", new[] { "MWK" } },
      { "AO", new[] { "AOA" } },
      { "CD", new[] { "CDF" } },
      { "MG", new[] { "MGA" } },
      { "MU", new[] { "MUR" } },
      { "SC", new[] { "SCR" } },
      { "KM", new[] { "KMF" } },
  };

  public static bool IsValid(string countryCode, string currencyCode)
  {
      return _validCurrencies.TryGetValue(countryCode, out var allowed)
          && allowed.Contains(currencyCode);
  }
}